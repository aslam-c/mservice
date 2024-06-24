module.exports = {
  apps: [
    {
      name: "Main Rest Server - Consumer",
      script: "build/app.js"
    },
    {
      name: "SQS Consumer",
      script: "build/app/services/intra-consumer.js"
    }
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": ""
    }
  }
};
