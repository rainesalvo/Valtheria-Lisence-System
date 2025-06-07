module.exports = {
    apps: [
      {
        name: "lisence",
        script: './index.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./" // Eğer script'in bulunduğu dizin kök dizin ise
      }
    ]
  };
  