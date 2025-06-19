document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lottie animations
  const welcomeAnim = lottie.loadAnimation({
    container: document.getElementById('welcome-animation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets5.lottiefiles.com/packages/lf20_5tkzkblw.json'
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    document.getElementById('sunIcon').classList.add('hidden');
    document.getElementById('moonIcon').classList.remove('hidden');
  }

  // Sidebar toggle
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  });

  // Tool system
  const tools = [
    {
      id: 'research',
      name: 'Research Assistant',
      icon: 'search',
      color: 'text-purple-500'
    },
    {
      id: 'voice',
      name: 'Voice AI',
      icon: 'microphone',
      color: 'text-blue-500'
    },
    // Add 8 more tools...
  ];

  // Build sidebar navigation
  const toolNav = document.getElementById('tool-nav');
  tools.forEach(tool => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button data-tool="${tool.id}" class="tool-btn w-full flex items-center p-3 rounded-lg hover:bg-gray-700 transition group">
        <i class="fas fa-${tool.icon} ${tool.color} text-lg w-6 text-center"></i>
        <span class="ml-3 hidden md:block group-hover:translate-x-1 transition">${tool.name}</span>
      </button>
    `;
    toolNav.appendChild(li);
  });

  // Tool loading system
  document.addEventListener('click', (e) => {
    if (e.target.closest('.tool-btn')) {
      const toolId = e.target.closest('.tool-btn').dataset.tool;
      loadTool(toolId);
    }
  });

  function loadTool(toolId) {
    document.getElementById('default-view').classList.add('hidden');
    const container = document.getElementById('tool-container');
    container.innerHTML = getToolUI(toolId);
    container.classList.remove('hidden');
    initializeTool(toolId);
  }

  function getToolUI(toolId) {
    const tool = tools.find(t => t.id === toolId);
    const uis = {
      research: `
        <div class="animate__animated animate__fadeIn">
          <div class="flex items-center mb-6">
            <i class="fas fa-${tool.icon} ${tool.color} text-2xl mr-3"></i>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${tool.name}</h2>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 class="text-lg font-semibold mb-4 dark:text-gray-200">Academic Research</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                  <input type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                <button class="btn-primary px-6 py-2 rounded-lg">
                  Generate Research
                </button>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 class="text-lg font-semibold mb-4 dark:text-gray-200">Results</h3>
              <div class="h-64 overflow-y-auto">
                <!-- Results will appear here -->
              </div>
            </div>
          </div>
        </div>
      `,
      voice: `
        <div class="animate__animated animate__fadeIn">
          <!-- Voice AI UI -->
        </div>
      `
    };
    return uis[toolId] || '<div class="text-center py-20 text-gray-500 dark:text-gray-400">Tool under development</div>';
  }
});
