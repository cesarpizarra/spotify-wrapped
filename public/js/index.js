const $spotifyDataContainer = $('#spotify-data');
const $skeletonLoader = $('#skeleton-loader');
const $playedSongChart = $('#playedSongChart');

// Show skeleton loader
function showSkeletonLoader() {
  $skeletonLoader.removeClass('hidden');
}

// Hide skeleton loader
function hideSkeletonLoader() {
  $skeletonLoader.addClass('hidden');
}

// Fetch top artists
function fetchTopArtists() {
  showSkeletonLoader();
  $.ajax({
    url: '/',
    method: 'GET',
    success: function (data) {
      hideSkeletonLoader();
      displayTopArtists(data.topArtists);
    },
    error: function (err) {
      hideSkeletonLoader();
      console.error('Error fetching top artists:', err);
    },
  });
}

// // Fetch plays and update chart
function fetchPlays() {
  showSkeletonLoader();
  $.ajax({
    url: '/plays',
    method: 'GET',
    success: function (data) {
      hideSkeletonLoader();
      updateChart(data);
      displayPlays(data);
    },
    error: function (err) {
      hideSkeletonLoader();
      console.error('Error fetching plays:', err);
    },
  });
}

// Display top artists dynamically
function displayTopArtists(data) {
  $spotifyDataContainer.empty();

  data.forEach((artist) => {
    const artistCard = `
      <div class="bg-gray-800 p-4 rounded-lg flex flex-col items-center shadow-md hover:shadow-lg transition">
        <img
          src="${artist.images[0]?.url}"
          alt="${artist.name}"
          class="w-32 h-32 rounded-full mb-4 object-cover border-4 border-gray-700"
        />
        <h3 class="text-lg font-bold text-center">${artist.name}</h3>
        <p class="text-sm text-gray-400 mt-2">Followers: ${artist.followers?.total.toLocaleString()}</p>
      </div>
    `;
    $spotifyDataContainer.append(artistCard);
  });
}

// Display the plays
function displayPlays(data) {
  const $playedSongsBody = $('#played-songs-body');
  $playedSongsBody.empty();

  data.forEach((item, index) => {
    const row = `
      <tr class="border-b border-gray-700 hover:bg-gray-600">
        <td class="px-4 py-2">${index + 1}</td>
        <td class="px-4 py-2">${item.song_name}</td>
        <td class="px-4 py-2 text-right">${item.play_count.toLocaleString()}</td>
      </tr>
    `;
    $playedSongsBody.append(row);
  });
}

// Update Chart.js data dynamically
function updateChart(data) {
  const labels = data.map((item) => item.song_name);
  const playCounts = data.map((item) => item.play_count);

  playedSongChart.data.labels = labels;
  playedSongChart.data.datasets[0].data = playCounts;
  playedSongChart.update();
}

// Initialize Chart.js
const playedSongChart = new Chart($playedSongChart[0], {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Play count',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Call fetchTopArtists when the page loads or when appropriate
$(document).ready(function () {
  fetchTopArtists();
  fetchPlays();
});
