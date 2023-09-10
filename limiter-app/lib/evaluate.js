const validateConfig = require('./schema.js');

module.exports = function evaluatePR(pullRequest, config, headBranch){
    const validationResult = validateConfig(config);

    // Check evaluate the PR
    if (validationResult.error) {
      return {conclusion: "failure", summary: 
          `Configuration is invalid, ${validationResult.error.details[0].message}`};
    }
    if (config.exemptLabels.some(label => pullRequest.labels.some(prLabel => prLabel.name == label))) {
      return {conclusion: "success", summary: "This PR was exempted from the limit check"};
    }
    if (config.exemptPRPrefix.some(prefix => headBranch.startsWith(prefix))) {
      return {conclusion: "success", summary: "This PR was exempted from the limit check"};
    }
    if (pullRequest.additions > config.maxAdditions && config.maxAdditions != -1) {
      return {conclusion: "failure", summary: "PR has too many line additions"};
    }
    if (pullRequest.deletions > config.maxDeletions && config.maxDeletions != -1) {
      return {conclusion: "failure", summary: "PR has too many line deletions"};
    }
    if (pullRequest.commits > config.maxCommits && config.maxCommits != -1) {
      return {conclusion: "failure", summary: "PR has too many commits"};
    }
    if (pullRequest.changed_files > config.maxChangedFiles && config.maxChangedFiles != -1) {
      return {conclusion: "failure", summary: "PR has too many changed files"};
    }
    return {conclusion: "success", summary: "PR is within limits"};
};

