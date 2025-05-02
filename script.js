let siswaData = [];

fetch('data.json')
.then(res => res.json())
.then(data => {
  siswaData = data.map(s => ({
    ...s,
    nisn: s.nisn.toString()
  }));
});

const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim().toLowerCase();
  suggestions.innerHTML = '';
  if (keyword.length === 0) {
    suggestions.classList.add('hidden');
    return;
  }

  // DEBOUNCE CARI NIS DAN NAMA
  const matches = siswaData.filter(s => 
    // s.nama.toLowerCase().startsWith(keyword) || 
    s.nisn.startsWith(keyword)
  );
  matches.slice(0, 5).forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.nama} (${s.nisn})`;
    li.className = 'p-2 hover:bg-blue-100 cursor-pointer';
    li.onclick = () => {
      searchInput.value = `${s.nama} (${s.nisn})`;
      suggestions.classList.add('hidden');
    };
    suggestions.appendChild(li);
  });
  suggestions.classList.remove('hidden');
});

function cekKelulusan() {
  const inputValue = searchInput.value.trim().toLowerCase();
  let nisnOnly = inputValue.match(/\d{5,}/);
  nisnOnly = nisnOnly ? nisnOnly[0] : inputValue;
  let siswa = siswaData.find(s => s.nisn === nisnOnly);
  if (!siswa) {
    const siswaByName = siswaData.find(s => s.nama.toLowerCase() === inputValue.toLowerCase());
    if (siswaByName) siswa = siswaByName;
  }

  const popup = document.getElementById('popup');
  const popupBox = document.getElementById('popupBox');
  const popupIcon = document.getElementById('popupIcon');
  const popupStatus = document.getElementById('popupStatus');
  const popupMessage = document.getElementById('popupMessage');

  popupBox.classList.remove('animate-popup-out');
  popupBox.classList.remove('animate-popup');
  void popupBox.offsetWidth;
  popupBox.classList.add('animate-popup');

  if (!siswa) {
    popupIcon.innerHTML = '<i class="ph ph-x-circle text-red-500"></i>';
    popupStatus.textContent = 'Data Tidak Ditemukan';
    popupMessage.textContent = 'Nama atau NISN tidak terdaftar.';
  } else if (siswa.status.toLowerCase() === 'lulus') {
    popupIcon.innerHTML = '<i class="ph ph-check-circle text-green-500"></i>';
    popupStatus.textContent = '🎉 Selamat! 🎉';
    popupMessage.innerHTML = `<strong>${siswa.nama}</strong><br>dinyatakan<br><strong>LULUS</strong>.`;
  } else {
    popupIcon.innerHTML = '<i class="ph ph-x-circle text-red-500"></i>';
    popupStatus.textContent = '😢 Maaf 😢';
    popupMessage.innerHTML = `<strong>${siswa.nama}</strong><br>dinyatakan<br><strong>TIDAK LULUS</strong>.`;
  }
  // HAPUS FORM
  searchInput.value = '';
  suggestions.classList.add('hidden');
  popup.classList.remove('hidden');
}

function closePopup() {
  const popup = document.getElementById('popup');
  const popupBox = document.getElementById('popupBox');
  popupBox.classList.remove('animate-popup');
  popupBox.classList.add('animate-popup-out');
  setTimeout(() => {
    popup.classList.add('hidden');
    popupBox.classList.remove('animate-popup-out');
  }, 200);
}