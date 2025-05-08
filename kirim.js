// kirim.js - Kirim Mahsulotlari sahifasi uchun skript

// Sahifa to'liq yuklanganda ishlaydigan funksiya
document.addEventListener('DOMContentLoaded', function() {

    // HTML elementlarini olish
    const rawMaterialFormDiv = document.getElementById('rawMaterialForm'); // Forma divi
    const addRawMaterialForm = document.getElementById('addRawMaterialForm'); // Forma elementi
    const rawFormTitle = document.getElementById('rawFormTitle'); // Forma sarlavhasi
    const rawMaterialsBody = document.getElementById('rawMaterialsBody'); // Jadval tbody elementi
    const rawSearchInput = document.getElementById('rawSearch'); // Qidirish inputi
    const rawUnitFilterSelect = document.getElementById('rawUnitFilter'); // Birlik filtri
    const rawImageInput = document.getElementById('rawImage'); // Rasm inputi
    const rawImagePreview = document.getElementById('rawImagePreview'); // Rasm ko'rinishi
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal')); // Rasm modal oynasi
    const modalImage = document.getElementById('modalImage'); // Modal ichidagi rasm

    // Tahlil qismining elementlari
    const totalRawMaterialsSpan = document.getElementById('totalRawMaterials');
    const totalRawSumSpan = document.getElementById('totalRawSum');

    // Ma'lumotlarni localStorage'dan olish yoki bo'sh massiv yaratish
    let rawMaterials = JSON.parse(localStorage.getItem('rawMaterials')) || [];

    // --- Funksiyalar ---

    // Formani ko'rsatish
    window.showRawMaterialForm = function(mode = 'add', index = -1) {
        rawMaterialFormDiv.style.display = 'block';
        addRawMaterialForm.reset(); // Formani tozalash
        document.getElementById('rawEditIndex').value = ''; // Tahrirlash indeksi

        rawImagePreview.style.display = 'none'; // Rasm ko'rinishini yashirish

        if (mode === 'add') {
            rawFormTitle.innerText = 'Yangi Kirim Qo\'shish';
        } else if (mode === 'edit' && index !== -1) {
            rawFormTitle.innerText = 'Kirimni Tahrirlash';
            const item = rawMaterials[index];
            document.getElementById('rawEditIndex').value = index; // Tahrirlanayotgan element indeksini saqlash
            document.getElementById('rawPerson').value = item.person;
            document.getElementById('rawAddress').value = item.address;
            document.getElementById('rawName').value = item.name;
            document.getElementById('rawUnitPrice').value = item.unitPrice;
            document.getElementById('rawTotalPrice').value = item.totalPrice;
            document.getElementById('rawQuantity').value = item.quantity;
            document.getElementById('rawUnit').value = item.unit;
            document.getElementById('rawDate').value = item.date;
            document.getElementById('rawSupplier').value = item.supplier;
            document.getElementById('rawOrigin').value = item.origin;
            document.getElementById('rawWeight').value = item.weight;
            document.getElementById('rawLength').value = item.length;
            document.getElementById('rawVolume').value = item.volume;
            document.getElementById('rawPackages').value = item.packages;
            document.getElementById('rawType').value = item.type;
            document.getElementById('rawNotes').value = item.notes;

            // Agar rasm mavjud bo'lsa, uni ko'rsatish
            if (item.image) {
                rawImagePreview.src = item.image;
                rawImagePreview.style.display = 'block';
            }
        }
    }

    // Formani yashirish
    window.hideRawMaterialForm = function() {
        rawMaterialFormDiv.style.display = 'none';
        addRawMaterialForm.reset(); // Formani tozalash
        document.getElementById('rawEditIndex').value = ''; // Tahrirlash indeksini tozalash
        rawImagePreview.style.display = 'none'; // Rasm ko'rinishini yashirish
    }

    // Ma'lumotlarni localStorage'ga saqlash
    function saveRawMaterials() {
        localStorage.setItem('rawMaterials', JSON.stringify(rawMaterials));
    }

    // Jadvalni chizish
    function renderRawMaterials(dataToRender = rawMaterials) {
        rawMaterialsBody.innerHTML = ''; // Jadvalni tozalash
        let totalSum = 0;

        if (dataToRender.length === 0) {
             rawMaterialsBody.innerHTML = '<tr><td colspan="11" class="text-center">Ma\'lumot topilmadi</td></tr>';
        } else {
            dataToRender.forEach((item, index) => {
                const row = document.createElement('tr');

                // Rasm ustiga bosilganda modal ochish
                const imageCell = document.createElement('td');
                if (item.image) {
                    const img = document.createElement('img');
                    img.src = item.image;
                    img.alt = item.name || 'Mahsulot rasmi';
                    img.style.width = '50px';
                    img.style.height = 'auto';
                    img.style.cursor = 'pointer'; // Kursor turini o'zgartirish
                    img.classList.add('img-thumbnail'); // Bootstrap stil
                    img.onclick = () => { // Rasmga bosilganda modalni ochish
                        modalImage.src = item.image;
                        imageModal.show();
                    };
                    imageCell.appendChild(img);
                } else {
                    imageCell.innerText = 'Rasm yo\'q';
                }
                row.appendChild(imageCell);


                row.innerHTML += `
                    <td>${item.person || ''}</td>
                    <td>${item.address || ''}</td>
                    <td>${item.name || ''}</td>
                    <td>${item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}</td>
                    <td>${item.totalPrice ? item.totalPrice.toFixed(2) : '0.00'}</td>
                    <td>${item.quantity || ''}</td>
                    <td>${item.unit || ''}</td>
                    <td>${item.date || ''}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-1" onclick="editRawMaterial(${index})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteRawMaterial(${index})"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                 // Yuqoridagi innerHTML qismida index o'rniga dataToRender ichidagi elementning asl indeksini topish kerak
                 // Qidirish/filtrlashda index o'zgarishi mumkin.
                 // Quyidagi kod asl indeksni topish uchun:
                 const originalIndex = rawMaterials.findIndex(raw => raw === item);
                 row.querySelector('.btn-warning').setAttribute('onclick', `editRawMaterial(${originalIndex})`);
                 row.querySelector('.btn-danger').setAttribute('onclick', `deleteRawMaterial(${originalIndex})`);


                rawMaterialsBody.appendChild(row);

                // Jami summani hisoblash
                totalSum += parseFloat(item.totalPrice) || 0;
            });
        }


        // Tahlil qismini yangilash
        totalRawMaterialsSpan.innerText = dataToRender.length;
        totalRawSumSpan.innerText = totalSum.toFixed(2); // 2 kasr xonasi bilan ko'rsatish
    }

    // Kirimni tahrirlash
    window.editRawMaterial = function(index) {
        showRawMaterialForm('edit', index);
    }

    // Kirimni o'chirish
    window.deleteRawMaterial = function(index) {
        if (confirm('Haqiqatan ham bu kirimni o\'chirmoqchimisiz?')) {
            rawMaterials.splice(index, 1); // Massivdan elementni o'chirish
            saveRawMaterials(); // localStorage'ga saqlash
            renderRawMaterials(); // Jadvalni qayta chizish
        }
    }

    // Barcha ma'lumotlarni tozalash
    window.clearData = function(type) {
        if (type === 'raw') {
            if (confirm('Haqiqatan ham barcha kirim ma\'lumotlarini o\'chirmoqchimisiz? Bu qaytarib bo\'lmaydi!')) {
                rawMaterials = []; // Massivni bo'shatish
                saveRawMaterials(); // localStorage'ni tozalash
                renderRawMaterials(); // Jadvalni qayta chizish
                 // Qidirish va filtrni tozalash
                rawSearchInput.value = '';
                rawUnitFilterSelect.value = '';
            }
        }
    }


    // --- Hodisa tinglovchilar ---

    // Forma yuborilganda
    addRawMaterialForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Sahifaning qayta yuklanishini oldini olish

        const index = document.getElementById('rawEditIndex').value; // Tahrirlash indeksi
        const person = document.getElementById('rawPerson').value;
        const address = document.getElementById('rawAddress').value;
        const name = document.getElementById('rawName').value;
        const unitPrice = parseFloat(document.getElementById('rawUnitPrice').value) || 0;
        const totalPrice = parseFloat(document.getElementById('rawTotalPrice').value) || 0;
        const quantity = parseFloat(document.getElementById('rawQuantity').value) || 0;
        const unit = document.getElementById('rawUnit').value;
        const date = document.getElementById('rawDate').value;
        const supplier = document.getElementById('rawSupplier').value;
        const origin = document.getElementById('rawOrigin').value;
        const weight = parseFloat(document.getElementById('rawWeight').value) || 0;
        const length = parseFloat(document.getElementById('rawLength').value) || 0;
        const volume = parseFloat(document.getElementById('rawVolume').value) || 0;
        const packages = parseInt(document.getElementById('rawPackages').value) || 0;
        const type = document.getElementById('rawType').value;
        const notes = document.getElementById('rawNotes').value;
        const image = rawImagePreview.src !== '' && rawImagePreview.style.display !== 'none' ? rawImagePreview.src : ''; // Rasm manzilini olish

        const newRawMaterial = {
            person,
            address,
            name,
            unitPrice,
            totalPrice,
            quantity,
            unit,
            date,
            supplier,
            origin,
            weight,
            length,
            volume,
            packages,
            type,
            notes,
            image // Rasm Data URL
        };

        if (index === '') {
            // Yangi qo'shish
            rawMaterials.push(newRawMaterial);
        } else {
            // Tahrirlash
            rawMaterials[parseInt(index)] = newRawMaterial;
        }

        saveRawMaterials(); // localStorage'ga saqlash
        renderRawMaterials(); // Jadvalni yangilash
        hideRawMaterialForm(); // Formani yashirish
    });

    // Qidirish inputiga yozilganda
    rawSearchInput.addEventListener('input', function() {
        filterAndRenderRawMaterials();
    });

    // Birlik filtri o'zgarganda
    rawUnitFilterSelect.addEventListener('change', function() {
        filterAndRenderRawMaterials();
    });

     // Rasm inputiga fayl tanlanganda
    rawImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                rawImagePreview.src = e.target.result;
                rawImagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file); // Rasmni Data URL formatida o'qish
        } else {
            rawImagePreview.src = '';
            rawImagePreview.style.display = 'none';
        }
    });


    // --- Qidirish va Filtrlash logikasi ---
    function filterAndRenderRawMaterials() {
        const searchTerm = rawSearchInput.value.toLowerCase();
        const selectedUnit = rawUnitFilterSelect.value;

        const filteredData = rawMaterials.filter(item => {
            const matchesSearch = !searchTerm ||
                                  (item.person && item.person.toLowerCase().includes(searchTerm)) ||
                                  (item.address && item.address.toLowerCase().includes(searchTerm)) ||
                                  (item.name && item.name.toLowerCase().includes(searchTerm)) ||
                                   (item.supplier && item.supplier.toLowerCase().includes(searchTerm)) ||
                                   (item.origin && item.origin.toLowerCase().includes(searchTerm)) ||
                                   (item.notes && item.notes.toLowerCase().includes(searchTerm));

            const matchesUnit = !selectedUnit || item.unit === selectedUnit;

            return matchesSearch && matchesUnit;
        });

        renderRawMaterials(filteredData); // Filtrlangan ma'lumotlarni chizish
    }


    // --- Eksport funksiyalari ---

    // Excelga eksport
    window.exportRawToExcel = function() {
        const dataToExport = rawMaterials.map(item => ({
            'Rasm URL': item.image || '', // Rasmni URL sifatida eksport qilish
            'Yuboruvchi Ismi': item.person || '',
            'Manzil': item.address || '',
            'Mahsulot Nomi': item.name || '',
            'Dona Summa': item.unitPrice || 0,
            'Jami Summa': item.totalPrice || 0,
            'Soni': item.quantity || 0,
            'Birlik': item.unit || '',
            'Sana': item.date || '',
            'Kimdan kelgani': item.supplier || '',
            'Qayerdan kelgani': item.origin || '',
            'Og\'irligi (kg)': item.weight || 0,
            'Uzunligi (sm)': item.length || 0,
            'Hajmi (L)': item.volume || 0,
            'Qadoq (pachka)': item.packages || 0,
            'Komplekt/Turi': item.type || '',
            'Qaydlar': item.notes || ''
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Kirim Mahsulotlari");

        XLSX.writeFile(wb, "kirim_mahsulotlari.xlsx");
    }

    // PDFga eksport
    window.exportRawToPDF = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape'); // Gorizontal format

        const tableColumn = [
            // "Rasm", // Rasmlarni PDF jadvaliga qo'shish murakkabroq, hozircha olib tashladim
            "Yuboruvchi Ismi",
            "Manzil",
            "Mahsulot Nomi",
            "Dona Summa",
            "Jami Summa",
            "Soni",
            "Birlik",
            "Sana",
            "Kimdan kelgani",
            "Qayerdan kelgani",
            "Og'irligi (kg)",
            "Uzunligi (sm)",
            "Hajmi (L)",
            "Qadoq (pachka)",
            "Komplekt/Turi",
            "Qaydlar"
        ];

        const tableRows = rawMaterials.map(item => [
            // item.image ? 'Rasm mavjud' : 'Rasm yo\'q', // Rasm ustuniga matn
            item.person || '',
            item.address || '',
            item.name || '',
            item.unitPrice ? item.unitPrice.toFixed(2) : '0.00',
            item.totalPrice ? item.totalPrice.toFixed(2) : '0.00',
            item.quantity || 0,
            item.unit || '',
            item.date || '',
            item.supplier || '',
            item.origin || '',
            item.weight || 0,
            item.length || 0,
            item.volume || 0,
            item.packages || 0,
            item.type || '',
            item.notes || ''
        ]);

        doc.autoTable(tableColumn, tableRows, {
            startY: 20,
            headStyles: { fillColor: [40, 167, 69] }, // Yashil rang
            margin: { top: 20, left: 10, right: 10 },
            styles: { fontSize: 8 },
            columnStyles: {
                // Rasm ustuni uchun kenglik (agar qo'shilsa)
                // 0: { cellWidth: 20 },
            }
        });

        doc.text("Kirim Mahsulotlari Ro'yxati", 14, 15);
        doc.save("kirim_mahsulotlari.pdf");
    }


    // Sahifa yuklanganda ma'lumotlarni chizish
    renderRawMaterials();

    // Avtomatik hisoblash funksiyalari (agar kerak bo'lsa)
    // Dona Summa * Soni = Jami Summa
    const rawUnitPriceInput = document.getElementById('rawUnitPrice');
    const rawQuantityInput = document.getElementById('rawQuantity');
    const rawTotalPriceInput = document.getElementById('rawTotalPrice');

    function calculateTotalPrice() {
        const unitPrice = parseFloat(rawUnitPriceInput.value) || 0;
        const quantity = parseFloat(rawQuantityInput.value) || 0;
        rawTotalPriceInput.value = (unitPrice * quantity).toFixed(2);
    }

    rawUnitPriceInput.addEventListener('input', calculateTotalPrice);
    rawQuantityInput.addEventListener('input', calculateTotalPrice);

});
