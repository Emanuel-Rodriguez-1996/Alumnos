window.addEventListener("load", inicio);

let sistema = new Sistema();

function inicio() {
    let selectElement = document.querySelector("#slcAlumnos");
    // Agregar la opción inicial
    selectElement.innerHTML = `<option value="-1">Seleccione una Alumno...</option>`;
    
    // Iterar sobre el array de alumnos y añadir opciones
    for (let i = 0; i < sistema.alumnos.length; i++) { 
        let alumno = sistema.alumnos[i];
        selectElement.innerHTML += `<option value="${alumno.id}">${alumno.nombre}</option>`;
    }

    // Cargar los registros desde Local Storage
    cargarRegistros();

    // Configurar el evento del botón "Registrar"
    document.querySelector("#registrarBtn").addEventListener("click", registrar);
}

function registrar() {
    // Obtener el ID del alumno seleccionado y la fecha
    let selectAlumno = document.querySelector("#slcAlumnos").value;
    let fechaInput = document.querySelector("#fecha").value;

    // Validar la selección
    if (selectAlumno === "-1" || !fechaInput) {
        alert("Por favor, seleccione un alumno y una fecha.");
        return;
    }

    // Convertir el ID seleccionado a número
    selectAlumno = parseInt(selectAlumno);

    // Encontrar el alumno seleccionado usando el ID
    let alumno;
    for (let i = 0; i < sistema.alumnos.length; i++) {
        if (sistema.alumnos[i].id === selectAlumno) {
            alumno = sistema.alumnos[i];
            break;
        }
    }

    // Construir la nueva fila con el botón de eliminar
    let nuevaFila = `
        <tr>
            <td>${alumno.nombre}</td>
            <td>${fechaInput}</td>
            <td><button class="eliminarFilaBtn">Eliminar</button></td>
        </tr>
    `;

    // Añadir la nueva fila a la tabla
    let tablaRegistros = document.querySelector("#tablaRegistros tbody");
    tablaRegistros.innerHTML += nuevaFila;

    // Guardar el nuevo registro en Local Storage
    guardarRegistro(alumno.nombre, fechaInput);

    // Limpiar el formulario
    document.querySelector("#slcAlumnos").value = "-1";
    document.querySelector("#fecha").value = "";

    // Configurar los botones de eliminar
    configurarBotonesEliminar();
}

function guardarRegistro(nombreAlumno, fecha) {
    // Recuperar los registros existentes desde Local Storage
    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    
    // Añadir el nuevo registro
    registros.push({ nombre: nombreAlumno, fecha: fecha });
    
    // Guardar los registros actualizados en Local Storage
    localStorage.setItem('registros', JSON.stringify(registros));
}

function cargarRegistros() {
    // Recuperar los registros desde Local Storage
    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    
    // Construir el HTML de la tabla con los registros recuperados
    let tablaRegistros = document.querySelector("#tablaRegistros tbody");
    tablaRegistros.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos datos
    
    registros.forEach((registro, index) => {
        let fila = `
            <tr data-index="${index}">
                <td>${registro.nombre}</td>
                <td>${registro.fecha}</td>
                <td><button class="eliminarFilaBtn">Eliminar</button></td>
            </tr>
        `;
        tablaRegistros.innerHTML += fila;
    });

    // Configurar los botones de eliminar
    configurarBotonesEliminar();
}

function configurarBotonesEliminar() {
    // Obtener todos los botones de eliminar
    let botonesEliminar = document.querySelectorAll(".eliminarFilaBtn");

    for (let i = 0; i < botonesEliminar.length; i++) {
        let boton = botonesEliminar[i];

        // Asignar un manejador de eventos onclick a cada botón
        boton.onclick = function(event) {
            // Obtener la fila que contiene el botón de eliminar
            let fila = event.target.parentElement.parentElement;
            let index = fila.getAttribute('data-index');
            
            // Obtener los registros desde Local Storage
            let registros = JSON.parse(localStorage.getItem('registros')) || [];
            
            // Eliminar el registro correspondiente del array
            registros.splice(index, 1);
            
            // Guardar los registros actualizados en Local Storage
            localStorage.setItem('registros', JSON.stringify(registros));
            
            // Recargar la tabla
            cargarRegistros();
        };
    }
}