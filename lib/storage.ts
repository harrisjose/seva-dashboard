import { Octokit } from '@octokit/rest'
import { format } from 'date-fns'
import { OctokitResponse } from '@octokit/types'

const owner = 'kanavuproject'
const repo = 'seva-dashboard'

const getPath = (date: Date): string => {
  return 'data/donations/' + format(date, 'yyyy-MM-dd') + '.json'
}

export async function save(date: Date, json: Object) {
  const github = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  const fileContent = Buffer.from(JSON.stringify(json)).toString('base64')

  const data = {
    owner,
    repo,
    path: getPath(date),
    message: `Add donations for ${format(date, 'yyyy-MM-dd')}`,
    content: fileContent,
    committer: { name: 'API', email: 'harrisconnected@gmail.com' },
  }

  try {
    await github.rest.repos.createOrUpdateFileContents(data)
    return { error: null }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

export async function read(date: Date) {
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
      const json = new Buffer(data.content, 'base64').toString('ascii')
      return { data: JSON.parse(json), error: null }
    } else {
      throw new Error('File content empty')
    }
  } catch (error) {
    console.error(error)
    return { error }
  }
}
