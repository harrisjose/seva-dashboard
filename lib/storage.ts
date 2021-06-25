import { Octokit } from '@octokit/rest'
import { format } from 'date-fns'
import { isEmpty } from 'lodash'

import type { OctokitResponse } from '@octokit/types'

const owner = process.env.GITHUB_OWNER || ''
const repo = process.env.GITHUB_REPO || ''

const getPath = (date: Date): string => {
  return 'data/' + format(date, 'yyyy-MM-dd') + '.json'
}

export async function readFile(date: Date) {
  const github = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  try {
    const response: OctokitResponse<any, 200> =
      await github.rest.repos.getContent({
        owner,
        repo,
        path: getPath(date),
      })

    const data = response?.data || {}

    if (data.content) {
      const json = Buffer.from(data.content, 'base64').toString('ascii')
      return JSON.parse(json)
    } else {
      throw new Error('File content empty')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function saveFile(date: Date, json: Object) {
  const github = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  let sha = null

  try {
    let { data: file }: OctokitResponse<any, 200> =
      await github.rest.repos.getContent({
        owner,
        repo,
        path: getPath(date),
      })
    sha = file?.sha || null
  } catch (error) {
    // Dont do anything because file doesnt exist
  }

  const fileContent = Buffer.from(JSON.stringify(json)).toString('base64')

  let data: any = {
    owner,
    repo,
    path: getPath(date),
    message: `Add donations for ${format(date, 'yyyy-MM-dd')}`,
    content: fileContent,
    committer: { name: 'API', email: process.env.GITHUB_EMAIL },
  }

  if (!isEmpty(sha)) {
    data['sha'] = sha
  }

  try {
    await github.rest.repos.createOrUpdateFileContents(data)
  } catch (error) {
    console.error(error)
    throw error
  }
}
