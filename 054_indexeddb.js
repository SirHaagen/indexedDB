
const openRequest= indexedDB.open("primerdb",1);
//Esta es la solicitud de apertura de BD. openRequest NO es la BD

openRequest.addEventListener("upgradeneeded",()=>{
  let db= openRequest.result;

  let store= db.createObjectStore("trabajadores",{autoIncrement: true});

  //Crear índices es opcional
  store.createIndex("index_edad", "edad");
  store.createIndex("index_email", "email", {unique: true});
  //Se agregará información del tipo {nombre: "Pepo", edad: 20, email: pepo@mail.com}

})

openRequest.addEventListener("success", ()=>{
  console.log("ok");
})

openRequest.addEventListener("error", e=>{
  console.log(e);
})

let addObjeto= objeto=>{
  //Agregar así: addObjeto({nombre: "Pepo", edad: 20, email: pepo@mail.com})

  let db= openRequest.result;

  const nuevaTransaccion= db.transaction("trabajadores", "readwrite");
  //Creo una nueva transacción

  const almacen= nuevaTransaccion.objectStore("trabajadores");
  //Traigo el almacén de objetos

  let peticion= almacen.add(objeto);
  //Almaceno el nuevo objeto

  peticion.addEventListener("success", ()=>{
    console.log("objeto agregado exitosamente");
  })

  peticion.addEventListener("error", e=>{
    console.error(e);
  })

  peticion.addEventListener("complete", ()=>{
    db.close();
  })

}

let modifyObjeto= (key, objeto)=>{
  //El orden de los parámetros de entrada es key, objeto (al revés da error)

  let db= openRequest.result;

  const nuevaTransaccion= db.transaction("trabajadores", "readwrite");
  //Creo una nueva transacción

  const almacen= nuevaTransaccion.objectStore("trabajadores");
  //Traigo el almacén de objetos

  let peticion= almacen.put(objeto, key);
  //Modifico el objeto. Se coloca objeto, key (al revés da error)

  peticion.addEventListener("success", ()=>{
    console.log("objeto modificado exitosamente");
  })

  peticion.addEventListener("error", e=>{
    console.error(e);
  })

  peticion.addEventListener("complete", ()=>{
    db.close();
  })

}

let deleteObjeto= key=>{
  //Se elimina un objeto buscando solamente con la llave (key)

  let db= openRequest.result;

  const nuevaTransaccion= db.transaction("trabajadores", "readwrite");
  //Creo una nueva transacción

  const almacen= nuevaTransaccion.objectStore("trabajadores");
  //Traigo el almacén de objetos

  let peticion= almacen.delete(key);
  //Elimino el objeto

  peticion.addEventListener("success", ()=>{
    console.log("objeto elimninado exitosamente");
  })

  peticion.addEventListener("error", e=>{
    console.error(e);
  })

  peticion.addEventListener("complete", ()=>{
    db.close();
  })

}

let readObjetos= ()=>{

  let db= openRequest.result;

  const nuevaTransaccion= db.transaction("trabajadores", "readonly");
  //Creo una nueva transacción pero como solo lectura

  const almacen= nuevaTransaccion.objectStore("trabajadores");
  //Traigo el almacén de objetos

  const cursor= almacen.openCursor();
  //creo el cursor con el método openCursor para tomar los objetos del almacén
  //Depués podemos obtener la llave con cursor.result.key y el valor con
  //cursor.result.value

  cursor.addEventListener("success", ()=>{
    if(cursor.result){
      console.table(cursor.result.value);
      //console.table me imprime una tabla con la información
      cursor.result.continue();
      //Con el if recorremos el almacén para traer todos los objetos uno a uno con el .continue
    }
    else console.log("Todos los datos fueron leídos exitosamente");
  })

  cursor.addEventListener("error", e=>{
    console.error(e);
  })

  cursor.addEventListener("complete", ()=>{
    db.close();
  })

}

let searchObjeto= (type, parametro)=>{
  //El tipo de consulta (type) puede ser por llave "key", por "email" o por "edad"
  
  let db= openRequest.result;

  const nuevaTransaccion= db.transaction("trabajadores", "readonly");
  //Creo una nueva transacción pero como solo lectura

  const almacen= nuevaTransaccion.objectStore("trabajadores");
  //Traigo el almacén de objetos

  let tipoParametro= "";  
  if(type== "edad"){
    tipoParametro= almacen.index("index_edad");
  }else if(type== "email"){
    tipoParametro= almacen.index("index_email");
  }else if(type== "key"){
    tipoParametro= almacen;
  }else console.error("El tipo es incorrecto");

  let consulta= tipoParametro.getAll(parametro);
  //Se utiliza el método getAll para traer todos los datos que coincidan con el parámetro

  consulta.addEventListener("success", ()=>{

    if (consulta.result.length !== 0) {
      console.table(consulta.result);
      //console.table me imprime una tabla con la información
    } else {
      console.error("Dato de búsqueda incorrecto");
    } 

  })

  consulta.addEventListener("error", e=>{
    console.error(e);
  })

  consulta.addEventListener("complete", ()=>{
    db.close();
  })

}

//! Para las funciones de arriba se puede simplificar (opcinal) creando una función que incluya:
//! let db= openRequest.result;
//! const nuevaTransaccion= db.transaction("trabajadores", "readwrite");
//! const almacen= nuevaTransaccion.objectStore("trabajadores");