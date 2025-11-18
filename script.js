// 1. CONFIGURACIÓN DE FIREBASE (USANDO TUS CREDENCIALES)
const firebaseConfig = {
    apiKey: "AIzaSyD2nCryUttIjg3HaY9-r44rIZsDP1mLB5w",
    authDomain: "euforia-inv.firebaseapp.com",
    projectId: "euforia-inv",
    storageBucket: "euforia-inv.firebasestorage.app",
    messagingSenderId: "687723551803",
    appId: "1:687723551803:web:a2a7b50fd78083883e501e",
    measurementId: "G-CSMDCL57X6"
};

// 2. INICIALIZACIÓN DE FIREBASE Y FIRESTORE
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase y Firestore inicializados correctamente.");
} catch (error) {
    console.error("Error al inicializar Firebase:", error);
}

// 3. OBTENER REFERENCIAS DEL DOM
const registroProductoForm = document.getElementById('registroProductoForm');
const statusMessage = document.getElementById('statusMessage');

// 4. FUNCIÓN PARA MOSTRAR MENSAJES DE ESTADO
function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

// 5. FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO
registroProductoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!db) {
        showStatusMessage("Error de conexión: Firestore no está disponible.", 'error');
        return;
    }

    // Recopilar los datos del formulario
    const name = document.getElementById('name').value;
    const area = document.getElementById('area').value; // Valor del selector
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value, 10);
    const imageUrl = document.getElementById('imageUrl').value;
    const color = document.getElementById('color').value;
    const customId = document.getElementById('id').value.trim();

    // Crear el objeto de datos del producto
    const nuevoProducto = {
        name: name,
        area: area,
        description: description,
        price: price,
        stock: stock,
        imageUrl: imageUrl,
        color: color,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // RUTA COMPLETA DE LA COLECCIÓN EN FIRESTORE
    const collectionRef = db.collection('artefactos').doc('euforia').collection('público').doc('datos').collection('productos');


    try {
        let docRef;

        if (customId) {
            await collectionRef.doc(customId).set(nuevoProducto);
            docRef = { id: customId };
        } else {
            docRef = await collectionRef.add(nuevoProducto);
        }

        showStatusMessage(`✅ Producto registrado con éxito! ID: ${docRef.id}`, 'success');
        registroProductoForm.reset();
        console.log("Documento escrito con ID: ", docRef.id);

    } catch (error) {
        console.error("Error al registrar el producto: ", error);
        showStatusMessage(`❌ Error al registrar: ${error.message}`, 'error');
    }
});
