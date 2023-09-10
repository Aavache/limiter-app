// Checks API example
// See: https://developer.github.com/v3/checks/ to learn more

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
const evaluatePR = require('./lib/evaluate')

const TITLE_CHECK = "Checking the size of the PR"
const NAME_CHECK = "PR size check"
const CONFIG_FNAME = "pr_limiter.yml"

function createResponse(context, startTime, headBranch, headSha, conclusion, summary){
    return context.octokit.checks.create(
      context.repo({
        name: NAME_CHECK,
        head_branch: headBranch,
        head_sha: headSha,
        status: "completed",
        started_at: startTime,
        conclusion: conclusion,
        completed_at: new Date(),
        output: {
          title: TITLE_CHECK,
          summary: summary,
        },
      })
    );
}

module.exports = (app) => {
  // Check the PR size on every new push or PR update
  app.on(["check_suite.requested", "check_run.rerequested"], check_suite);
  // Check if the PR label was updated
  app.on(["pull_request.labeled", "pull_request.unlabeled"], check_label_update);

  async function check_label_update(context) {
    const startTime = new Date();

    const headBranch = context.payload.pull_request.head.ref
    const headSha = context.payload.pull_request.head.sha

    const { data: pullRequest } = await context.octokit.pulls.get({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      pull_number: context.payload.pull_request.number,
    });

    const config = await context.config(CONFIG_FNAME)

    evaluation = evaluatePR(pullRequest, config, headBranch);

    return createResponse(context, startTime, 
        headBranch, headSha, evaluation.conclusion, evaluation.summary)
  };

  async function check_suite(context) {
    const startTime = new Date();
    const { head_branch: headBranch, head_sha: headSha } =
      context.payload.check_suite;

    // Retrieve the PR information for the associated commit
    const { data: pullRequest } = await context.octokit.pulls.get({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      pull_number: context.payload.check_suite.pull_requests[0].number,
    });

    const config = await context.config(CONFIG_FNAME)

    evaluation = evaluatePR(pullRequest, config, headBranch);
    
    return createResponse(
      context, startTime, headBranch, headSha, evaluation.conclusion, evaluation.summary)
  }
};
