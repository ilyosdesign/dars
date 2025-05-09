const { jsPDF } = window.jspdf;

let warehouseData = {
    rawMaterials: [],
    products: [],
    logo: null
};

function loadData() {
    const savedData = localStorage.getItem('warehouseData');
    if (savedData) {
        warehouseData = JSON.parse(savedData);
    } else {
        warehouseData = {
            rawMaterials: [
                {
                    person: "Aliyev Sh.",
                    address: "Andijon shahar",
                    name: "LDSP",
                    unitPrice: 100000,
                    totalPrice: 5000000,
                    quantity: 50,
                    unit: "dona",
                    date: "2025-05-08",
                    supplier: "Andijon Mebel",
                    origin: "Andijon",
                    weight: 500,
                    length: 280,
                    volume: 100,
                    packages: 10,
                    type: "18mm",
                    notes: "Oq rang",
                    image: null
                }
            ],
            products: [
                {
                    person: "Karimov B.",
                    address: "Andijon shahar",
                    name: "Shkaf",
                    unitPrice: 2000000,
                    totalPrice: 10000000,
                    quantity: 5,
                    unit: "dona",
                    date: "2025-05-08",
                    height: 200,
                    width: 150,
                    depth: 60,
                    description: "3 eshikli, oq rang",
                    materials: "2 LDSP, 10 Samarez",
                    image: null
                }
            ],
            logo: null
        };
    }
    if (window.location.pathname.includes('index.html') || window.location.pathname.includes('settings.html')) {
        displayLogo();
    } else if (window.location.pathname.includes('kirim.html')) {
        displayRawMaterials();
        updateRawAnalytics();
        checkLowStock('raw');
    } else if (window.location.pathname.includes('chiqim.html')) {
        displayProducts();
        updateProductAnalytics();
        checkLowStock('product');
    }
}

function displayLogo() {
    const logoImg = document.getElementById('companyLogo');
    if (logoImg && warehouseData.logo) {
        logoImg.src = warehouseData.logo;
        logoImg.style.display = 'block';
    }
}

document.getElementById('logoUpload')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            warehouseData.logo = event.target.result;
            saveData();
            displayLogo();
        };
        reader.readAsDataURL(file);
    } else {
        alert('Faqat JPG yoki PNG fayllarni yuklash mumkin!');
    }
});

function displayRawMaterials(searchTerm = '', unitFilter = '') {
    const tbody = document.getElementById('rawMaterialsBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const filteredMaterials = warehouseData.rawMaterials.filter(material => 
        (material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (material.person && material.person.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (material.address && material.address.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (unitFilter ? material.unit === unitFilter : true)
    );
    filteredMaterials.forEach((material, index) => {
        const row = document.createElement('tr');
        const lowStock = material.quantity < 10 && material.unit === 'dona' ? 'low-stock' : '';
        row.innerHTML = `
            <td><img src="${material.image || ''}" class="thumbnail" onclick="showImage('${material.image || ''}')" alt="Rasm" style="${material.image ? '' : 'display: none;'}"></td>
            <td>${material.person || ''}</td>
            <td>${material.address || ''}</td>
            <td>${material.name}</td>
            <td>${material.unitPrice || ''}</td>
            <td>${material.totalPrice || ''}</td>
            <td class="${lowStock}">${material.quantity}</td>
            <td>${material.unit}</td>
            <td>${material.date || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editRawMaterial(${index})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteRawMaterial(${index})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayProducts(searchTerm = '', unitFilter = '') {
    const tbody = document.getElementById('productsBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const filteredProducts = warehouseData.products.filter(product => 
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.person && product.person.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.address && product.address.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (unitFilter ? product.unit === unitFilter : true)
    );
    filteredProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image || ''}" class="thumbnail" onclick="showImage('${product.image || ''}')" alt="Rasm" style="${product.image ? '' : 'display: none;'}"></td>
            <td>${product.person || ''}</td>
            <td>${product.address || ''}</td>
            <td>${product.name}</td>
            <td>${product.unitPrice || ''}</td>
            <td>${product.totalPrice || ''}</td>
            <td>${product.quantity}</td>
            <td>${product.unit}</td>
            <td>${product.date || ''}</td>
            <td>${product.height || ''}</td>
            <td>${product.width || ''}</td>
            <td>${product.depth || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${index})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showImage(imageSrc) {
    if (!imageSrc) return;
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    document.getElementById('modalImage').src = imageSrc;
    modal.show();
}

function updateRawAnalytics() {
    const totalRawMaterials = warehouseData.rawMaterials.length;
    const totalRawSum = warehouseData.rawMaterials.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
    const totalRaw = document.getElementById('totalRawMaterials');
    const totalSum = document.getElementById('totalRawSum');
    if (totalRaw) totalRaw.textContent = totalRawMaterials;
    if (totalSum) totalSum.textContent = totalRawSum.toFixed(2);
}

function updateProductAnalytics() {
    const totalProducts = warehouseData.products.length;
    const totalProductSum = warehouseData.products.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
    const totalProd = document.getElementById('totalProducts');
    const totalSum = document.getElementById('totalProductSum');
    if (totalProd) totalProd.textContent = totalProducts;
    if (totalSum) totalSum.textContent = totalProductSum.toFixed(2);
}

function checkLowStock(type) {
    if (type === 'raw') {
        const lowStockItems = warehouseData.rawMaterials.filter(m => m.quantity < 10 && m.unit === 'dona');
        if (lowStockItems.length > 0) {
            const names = lowStockItems.map(m => `${m.name} (${m.quantity} ${m.unit})`).join(', ');
            alert(`Kam qolgan materiallar: ${names}`);
        }
    }
}

function validateRawMaterial(data) {
    if (!data.name) return "Mahsulot nomi kiritilishi shart!";
    if (data.quantity && isNaN(data.quantity)) return "Son raqam bo'lishi kerak!";
    return null;
}

function validateProduct(data) {
    if (!data.name) return "Mahsulot nomi kiritilishi shart!";
    if (data.quantity && isNaN(data.quantity)) return "Son raqam bo'lishi kerak!";
    return null;
}

function setupFormValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (isNaN(this.value) || this.value < 0) {
                this.classList.add('is-invalid');
                this.nextElementSibling.textContent = `${this.previousElementSibling.textContent} raqam bo'lishi kerak!`;
            } else {
                this.classList.remove('is-invalid');
            }
        });
    });
}

function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            alert('Faqat JPG yoki PNG fayllarni yuklash mumkin!');
            input.value = '';
            preview.style.display = 'none';
        }
    });
}

function consumeRawMaterials(materials) {
    if (!materials) return true;
    const materialList = materials.split(',').map(item => {
        const parts = item.trim().split(' ');
        if (parts.length < 2) return null;
        const quantity = parseFloat(parts[0]);
        const name = parts.slice(1).join(' ');
        return { quantity, name };
    }).filter(item => item !== null);

    for (const { quantity, name } of materialList) {
        const material = warehouseData.rawMaterials.find(m => m.name.toLowerCase() === name.toLowerCase());
        if (!material) {
            alert(`${name} omborda topilmadi!`);
            return false;
        }
        if (material.unit !== 'dona' && material.unit !== 'pachka') {
            alert(`${name} uchun miqdor faqat dona yoki pachka bo'lishi mumkin!`);
            return false;
        }
        const newQuantity = (parseFloat(material.quantity) || 0) - quantity;
        if (newQuantity < 0) {
            alert(`${name} uchun yetarli miqdor yo'q! Qoldiq: ${material.quantity} ${material.unit}`);
            return false;
        }
        material.quantity = newQuantity;
    }
    return true;
}

function showRawMaterialForm(mode, index = null) {
    const form = document.getElementById('rawMaterialForm');
    const title = document.getElementById('rawFormTitle');
    if (!form) return;
    form.style.display = 'block';
    
    if (mode === 'edit' && index !== null) {
        title.textContent = 'Kirim Tahrirlash';
        const material = warehouseData.rawMaterials[index];
        document.getElementById('rawEditIndex').value = index;
        document.getElementById('rawPerson').value = material.person || '';
        document.getElementById('rawAddress').value = material.address || '';
        document.getElementById('rawName').value = material.name;
        document.getElementById('rawUnitPrice').value = material.unitPrice || '';
        document.getElementById('rawTotalPrice').value = material.totalPrice || '';
        document.getElementById('rawQuantity').value = material.quantity;
        document.getElementById('rawUnit').value = material.unit;
        document.getElementById('rawDate').value = material.date || '';
        document.getElementById('rawSupplier').value = material.supplier || '';
        document.getElementById('rawOrigin').value = material.origin || '';
        document.getElementById('rawWeight').value = material.weight || '';
        document.getElementById('rawLength').value = material.length || '';
        document.getElementById('rawVolume').value = material.volume || '';
        document.getElementById('rawPackages').value = material.packages || '';
        document.getElementById('rawType').value = material.type || '';
        document.getElementById('rawNotes').value = material.notes || '';
        const preview = document.getElementById('rawImagePreview');
        if (material.image) {
            preview.src = material.image;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    } else {
        title.textContent = 'Yangi Kirim';
        document.getElementById('addRawMaterialForm').reset();
        document.getElementById('rawEditIndex').value = '';
        document.getElementById('rawDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('rawImagePreview').style.display = 'none';
    }
}

function hideRawMaterialForm() {
    const form = document.getElementById('rawMaterialForm');
    if (form) form.style.display = 'none';
}

function showProductForm(mode, index = null) {
    const form = document.getElementById('productForm');
    const title = document.getElementById('productFormTitle');
    if (!form) return;
    form.style.display = 'block';
    
    if (mode === 'edit' && index !== null) {
        title.textContent = 'Chiqim Tahrirlash';
        const product = warehouseData.products[index];
        document.getElementById('productEditIndex').value = index;
        document.getElementById('productPerson').value = product.person || '';
        document.getElementById('productAddress').value = product.address || '';
        document.getElementById('productName').value = product.name;
        document.getElementById('productUnitPrice').value = product.unitPrice || '';
        document.getElementById('productTotalPrice').value = product.totalPrice || '';
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productUnit').value = product.unit;
        document.getElementById('productDate').value = product.date || '';
        document.getElementById('productHeight').value = product.height || '';
        document.getElementById('productWidth').value = product.width || '';
        document.getElementById('productDepth').value = product.depth || '';
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productMaterials').value = product.materials || '';
        const preview = document.getElementById('productImagePreview');
        if (product.image) {
            preview.src = product.image;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    } else {
        title.textContent = 'Yangi Chiqim';
        document.getElementById('addProductForm').reset();
        document.getElementById('productEditIndex').value = '';
        document.getElementById('productDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('productImagePreview').style.display = 'none';
    }
}

function hideProductForm() {
    const form = document.getElementById('productForm');
    if (form) form.style.display = 'none';
}

document.getElementById('addRawMaterialForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const index = document.getElementById('rawEditIndex').value;
    const imageFile = document.getElementById('rawImage').files[0];
    const data = {
        person: document.getElementById('rawPerson').value || '',
        address: document.getElementById('rawAddress').value || '',
        name: document.getElementById('rawName').value,
        unitPrice: parseFloat(document.getElementById('rawUnitPrice').value) || 0,
        totalPrice: parseFloat(document.getElementById('rawTotalPrice').value) || 0,
        quantity: parseFloat(document.getElementById('rawQuantity').value) || 0,
        unit: document.getElementById('rawUnit').value,
        date: document.getElementById('rawDate').value || '',
        supplier: document.getElementById('rawSupplier').value || '',
        origin: document.getElementById('rawOrigin').value || '',
        weight: parseFloat(document.getElementById('rawWeight').value) || 0,
        length: parseFloat(document.getElementById('rawLength').value) || 0,
        volume: parseFloat(document.getElementById('rawVolume').value) || 0,
        packages: parseInt(document.getElementById('rawPackages').value) || 0,
        type: document.getElementById('rawType').value || '',
        notes: document.getElementById('rawNotes').value || '',
        image: document.getElementById('rawImagePreview').src && document.getElementById('rawImagePreview').style.display !== 'none' ? document.getElementById('rawImagePreview').src : null
    };

    const error = validateRawMaterial(data);
    if (error) {
        alert(error);
        return;
    }

    if (index !== '') {
        warehouseData.rawMaterials[index] = data;
    } else {
        warehouseData.rawMaterials.push(data);
    }
    saveData();
    displayRawMaterials();
    updateRawAnalytics();
    checkLowStock('raw');
    this.reset();
    document.getElementById('rawImagePreview').style.display = 'none';
    hideRawMaterialForm();
});

document.getElementById('addProductForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const index = document.getElementById('productEditIndex').value;
    const materials = document.getElementById('productMaterials').value || '';
    const data = {
        person: document.getElementById('productPerson').value || '',
        address: document.getElementById('productAddress').value || '',
        name: document.getElementById('productName').value,
        unitPrice: parseFloat(document.getElementById('productUnitPrice').value) || 0,
        totalPrice: parseFloat(document.getElementById('productTotalPrice').value) || 0,
        quantity: parseFloat(document.getElementById('productQuantity').value) || 0,
        unit: document.getElementById('productUnit').value,
        date: document.getElementById('productDate').value || '',
        height: parseFloat(document.getElementById('productHeight').value) || 0,
        width: parseFloat(document.getElementById('productWidth').value) || 0,
        depth: parseFloat(document.getElementById('productDepth').value) || 0,
        description: document.getElementById('productDescription').value || '',
        materials: materials,
        image: document.getElementById('productImagePreview').src && document.getElementById('productImagePreview').style.display !== 'none' ? document.getElementById('rawImagePreview').src : null
    };

    const error = validateProduct(data);
    if (error) {
        alert(error);
        return;
    }

    if (index === '' && materials) {
        if (!consumeRawMaterials(materials)) {
            return;
        }
    }

    if (index !== '') {
        warehouseData.products[index] = data;
    } else {
        warehouseData.products.push(data);
    }
    saveData();
    displayProducts();
    updateProductAnalytics();
    checkLowStock('product');
    this.reset();
    document.getElementById('productImagePreview').style.display = 'none';
    hideProductForm();
});

function deleteRawMaterial(index) {
    if (confirm('Bu kirimni o\'chirishni xohlaysizmi?')) {
        warehouseData.rawMaterials.splice(index, 1);
        saveData();
        displayRawMaterials();
        updateRawAnalytics();
        checkLowStock('raw');
    }
}

function deleteProduct(index) {
    if (confirm('Bu chiqimni o\'chirishni xohlaysizmi?')) {
        warehouseData.products.splice(index, 1);
        saveData();
        displayProducts();
        updateProductAnalytics();
        checkLowStock('product');
    }
}

function clearData(type) {
    if (confirm('Barcha ma\'lumotlarni o\'chirishni xohlaysizmi?')) {
        if (type === 'raw') {
            warehouseData.rawMaterials = [];
            displayRawMaterials();
            updateRawAnalytics();
        } else if (type === 'product') {
            warehouseData.products = [];
            displayProducts();
            updateProductAnalytics();
        }
        saveData();
    }
}

document.getElementById('rawSearch')?.addEventListener('input', function() {
    const unitFilter = document.getElementById('rawUnitFilter')?.value || '';
    displayRawMaterials(this.value, unitFilter);
});

document.getElementById('rawUnitFilter')?.addEventListener('change', function() {
    const searchTerm = document.getElementById('rawSearch')?.value || '';
    displayRawMaterials(searchTerm, this.value);
});

document.getElementById('productSearch')?.addEventListener('input', function() {
    const unitFilter = document.getElementById('productUnitFilter')?.value || '';
    displayProducts(this.value, unitFilter);
});

document.getElementById('productUnitFilter')?.addEventListener('change', function() {
    const searchTerm = document.getElementById('productSearch')?.value || '';
    displayProducts(searchTerm, this.value);
});

function saveData() {
    localStorage.setItem('warehouseData', JSON.stringify(warehouseData));
}

function exportRawToExcel() {
    const ws = XLSX.utils.json_to_sheet(warehouseData.rawMaterials.map(m => ({
        'Yuboruvchi Ismi': m.person || '',
        'Manzil': m.address || '',
        'Mahsulot Nomi': m.name,
        'Dona Summa': m.unitPrice || '',
        'Jami Summa': m.totalPrice || '',
        'Soni': m.quantity,
        'Birlik': m.unit,
        'Sana': m.date || '',
        'Kimdan': m.supplier || '',
        'Qayerdan': m.origin || '',
        'Og\'irligi (kg)': m.weight || '',
        'Uzunligi (sm)': m.length || '',
        'Hajmi (L)': m.volume || '',
        'Qadoq': m.packages || '',
        'Komplekt/Turi': m.type || '',
        'Qaydlar': m.notes || ''
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kirim');
    XLSX.write(wb, 'kirim_data.xlsx');
}

function exportProductToExcel() {
    const ws = XLSX.utils.json_to_sheet(warehouseData.products.map(p => ({
        'Buyurtmachi Ismi': p.person || '',
        'Manzil': p.address || '',
        'Mahsulot Nomi': p.name,
        'Dona Summa': p.unitPrice || '',
        'Jami Summa': p.totalPrice || '',
        'Soni': p.quantity,
        'Birlik': p.unit,
        'Sana': p.date || '',
        'Bo\'yi (sm)': p.height || '',
        'Eni (sm)': p.width || '',
        'Chuqurligi (sm)': p.depth || '',
        'Tavsif': p.description || '',
        'Xom Ashyo': p.materials || ''
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Chiqim');
    XLSX.write(wb, 'chiqim_data.xlsx');
}

function exportRawToPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Kirim Mahsulotlari - Chek', 105, 20, { align: 'center' });
    
    if (warehouseData.logo) {
        doc.addImage(warehouseData.logo, 'PNG', 10, 10, 30, 30);
    }
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('TOJMAHAL GROUP', 50, 30);
    doc.text('Manzil: Andijon shahar Eski osh ko\'cha', 50, 35);
    doc.text(`Sana: ${new Date().toLocaleDateString('uz-UZ')}`, 50, 40);

    doc.autoTable({
        startY: 50,
        head: [['#', 'Yuboruvchi Ismi', 'Manzil', 'Mahsulot Nomi', 'Dona Summa', 'Jami Summa', 'Soni', 'Birlik', 'Sana']],
        body: warehouseData.rawMaterials.map((m, i) => [
            i + 1,
            m.person || '',
            m.address || '',
            m.name,
            m.unitPrice || '',
            m.totalPrice || '',
            m.quantity,
            m.unit,
            m.date || ''
        ]),
        theme: 'grid',
        headStyles: { fillColor: [255, 193, 7], textColor: [255, 255, 255] },
        styles: { fontSize: 8 },
        margin: { top: 50 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Jami kirim turlari: ${warehouseData.rawMaterials.length}`, 20, finalY);
    doc.text(`Jami summa: ${warehouseData.rawMaterials.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0).toFixed(2)} so'm`, 20, finalY + 5);
    
    doc.save('kirim_check.pdf');
}

function exportProductToPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Chiqim Mahsulotlari - Chek', 105, 20, { align: 'center' });
    
    if (warehouseData.logo) {
        doc.addImage(warehouseData.logo, 'PNG', 10, 10, 30, 30);
    }
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('TOJMAHAL GROUP', 50, 30);
    doc.text('Manzil: Andijon shahar Eski osh ko\'cha', 50, 35);
    doc.text(`Sana: ${new Date().toLocaleDateString('uz-UZ')}`, 50, 40);

    doc.autoTable({
        startY: 50,
        head: [['#', 'Buyurtmachi Ismi', 'Manzil', 'Mahsulot Nomi', 'Dona Summa', 'Jami Summa', 'Soni', 'Birlik', 'Sana', 'Bo\'yi', 'Eni', 'Chuqurligi']],
        body: warehouseData.products.map((p, i) => [
            i + 1,
            p.person || '',
            p.address || '',
            p.name,
            p.unitPrice || '',
            p.totalPrice || '',
            p.quantity,
            p.unit,
            p.date || '',
            p.height || '',
            p.width || '',
            p.depth || ''
        ]),
        theme: 'grid',
        headStyles: { fillColor: [108, 117, 125], textColor: [255, 255, 255] },
        styles: { fontSize: 8 },
        margin: { top: 50 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Jami chiqim turlari: ${warehouseData.products.length}`, 20, finalY);
    doc.text(`Jami summa: ${warehouseData.products.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0).toFixed(2)} so'm`, 20, finalY + 5);
    
    doc.save('chiqim_check.pdf');
}

window.onload = function() {
    loadData();
    setupFormValidation();
    setupImagePreview('rawImage', 'rawImagePreview');
    setupImagePreview('productImage', 'productImagePreview');
};