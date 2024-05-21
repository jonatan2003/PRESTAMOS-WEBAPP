import { Injectable } from '@angular/core';
import { dA } from '@fullcalendar/core/internal-common';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';


@Injectable({
  providedIn: 'root'
})
export class ImpresionService {

  constructor() { }

  imprimir(entidad: string, encabezado: string[], cuerpo: Array<any>, titulo: string, guardar?: boolean) {
    // Formatear el documento
    const doc = new jsPDF({
      orientation: "landscape", // Cambiar la orientación a horizontal
        // orientation: "portrait",
        unit: "px",
        format: 'a4'
    });
  
    // Agregar el título al documento
    doc.text(titulo, doc.internal.pageSize.width / 2, 10, {
        align: 'center',
    });

    // Agregar la tabla al documento
    autoTable(doc, {

        head: [encabezado],
        body: cuerpo,
        
    });

    // Guardar el documento si guardar es verdadero
    if (guardar) {
        const hoy = new Date();
        doc.save(entidad + "_" + hoy.getDate() + (hoy.getMonth() + 1) + hoy.getFullYear() + "_" + hoy.getTime() + '.pdf');
    } else {
        // Hacer algo si no se quiere guardar el documento (opcional)
    }
}



// IMPRESION DEL PRESTAMO 

async imprimirFilaPrestamos(entidad: string, datos: any) {
  const doc1 = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [2.9, 7],
  });


// Función para generar un número aleatorio de 4 dígitos
function generateRandomNumber() {
  return Math.floor(10000 + Math.random() * 90000); // Genera un número aleatorio entre 1000 y 9999
}

// Función para generar una cadena aleatoria de 5 caracteres
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Generar el código QR único
const qrData = `Datos del préstamo: ${JSON.stringify(datos)}`;
const qrCodeDataURL = await QRCode.toDataURL(qrData);



// Genera un número de serie único
const nro_serie = `Serie: ${datos.num_serie}        Ticket:${datos.num_ticket} `;



  // Datos de la empresa
  const empresa = '               CASA DE EMPEÑOS DON GATO';
  const direccion = `Calle: Principal 123, Ciudad    Teléfono: 987654233`;

  const ruc =`                      R.U.C: 10785645876`;
  // Datos del préstamo
  const cliente = `Cliente: ${datos.cliente}      Dni: ${datos.dni}`;
  const empleado = `Empleado: ${datos.empleado} `;
  const descripcion = `Articulo                 Prestamo                  Pagar` ;
  const articulo = `${datos.articulo}                ${datos.montoPrestamo}                  S/.${datos.montoPago}`;
  const fechaPrestamo = `Fecha: ${datos.fechaPrestamo}`;
  const estado = `Estado: ${datos.estado}               Devolucion: ${datos.fechaDevolucion}`;


  // Contenido del encabezado
  const encabezado = [
      [empresa],
  ];

  // Contenido del cuerpo
  const cuerpo = [
      [ruc],
      [nro_serie],
      [direccion], 
      [fechaPrestamo],
      [''],
      [cliente],
      [empleado],
      [''],
      [descripcion],
      [articulo],
      [estado],

      [''],
      [''],
      [''],
      [''],
      [''],
      [''],
      [''],
      ['                     Gracias por tu Preferencia¡'],
  ];

  // Configuración de la tabla
  const margintop = 1.1;
  const marginBottom = 0; // Margen inferior
  const marginleft = 0;
  const marginright = 0;

  // Obtener el ancho del código QR basado en su proporción
  const qrWidth = 1.4;
  const qrHeight = 1;

  // Ajustar las coordenadas del código QR para que aparezca en una esquina o en la parte inferior de la boleta
  const qrX = 0.8; // Coordenada X
  const qrY = 4.8; // Coordenada Y

  // Convertir la imagen a Base64
  const imgData = await this.getBase64ImageFromURL('/assets/img/login/gato.png');
  // doc1.addImage(imgData, 'PNG', 1.5, 0.2, 1.1, 1.1); // Ajusta las coordenadas (0.5, 0.5) y el tamaño de la imagen (3, 1)
  doc1.addImage(imgData, 'PNG', 0.9, 0, 1.1, 1);

  doc1.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrWidth, qrHeight);

  autoTable(doc1, {
      startY: margintop,
      head: encabezado ,
      body: cuerpo,

      styles: {
        fontSize: 8, // Tamaño de la letra de hoja
        halign: 'justify', // Alineación horizontal justificada
        textColor: [0, 0, 0] // Color del texto en RGB (negro)
    },
      theme: 'plain',
      tableWidth: doc1.internal.pageSize.width - 0.2 , // Ancho de la tabla
      margin: { // Adjust the margins
        top: margintop,
        bottom: marginBottom,
        left: marginleft + 0.1,
        right: marginright +0
    },


    didDrawCell: (data) => {
      if (data.section === 'body') {
          // Establecer color de los bordes
          doc1.setDrawColor(0); // Color negro
            // Dibujar borde superior
            if (data.row.index === 0) {
              // Si es la primera fila, no dibujar el borde superior
              doc1.setLineWidth(0);
          } else if (data.row.index === cuerpo.length - 1) {
              // Si es la última fila, no dibujar el borde inferior
              doc1.setLineWidth(0);
          } else if (data.row.index === 2 || data.row.index === 3) {
              // Si es la tercera o cuarta fila, no dibujar los bordes
              doc1.setLineWidth(0);
          } else if (data.row.index === 4|| data.row.index === 7) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else if ( data.row.index === 8 || data.row.index === 11 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }  
          else if ( data.row.index === 12 || data.row.index === 13 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }
          else if ( data.row.index === 14 || data.row.index === 15 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else if ( data.row.index === 16 || data.row.index === 17 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }
          else {
              // Si no es la primera ni la última fila, dibujar los bordes
              doc1.line(data.cell.x, data.cell.y, data.cell.x + data.cell.width, data.cell.y); // Borde superior
              doc1.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height); // Borde inferior
          }
      }
    }
  });



 // Guardar o mostrar el documento
    const hoy = new Date();
    doc1.save(entidad + "_" + hoy.getDate() + (hoy.getMonth()+1) + hoy.getFullYear()+ "_" + hoy.getTime() + '.pdf')


  }


  async getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width ;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  }

  // Método para generar un número de ticket único
generateUniqueTicketNumber(): string {
  // Genera un número aleatorio único usando la marca de tiempo actual
  const uniqueNumber = new Date().getTime().toString();
  return uniqueNumber;
}


// IMPRESION DEL Pago

async imprimirFilaPagos(entidad: string, datos: any) {
  const doc1 = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [2.9, 7],
  });


// Función para generar un número aleatorio de 4 dígitos
function generateRandomNumber() {
  return Math.floor(10000 + Math.random() * 90000); // Genera un número aleatorio entre 1000 y 9999
}

// Función para generar una cadena aleatoria de 5 caracteres
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Generar el código QR único
const qrData = `Datos del préstamo: ${JSON.stringify(datos)}`;
const qrCodeDataURL = await QRCode.toDataURL(qrData);



// Genera un número de serie único
const nro_serie = `Serie: T${generateRandomString(3)}-000${generateRandomNumber()}         Ticket:${this.generateUniqueTicketNumber()}`;



  // Datos de la empresa
  const empresa = '               CASA DE EMPEÑOS DON GATO';
  const direccion = `Calle: Principal 123, Ciudad    Teléfono: 987654233`;
  const ruc =`                      R.U.C: 10785645876`;

  // Datos del préstamo
  const cliente = `Cliente: ${datos.cliente}                  Dni: ${datos.dni}`;

  const empleado = `Empleado: ${datos.empleado} `;
  const descripcion = `Articulo                        Interes                    Restante` ;
  const articulo = `${datos.articulo}                     ${datos.interes_pago}                        S/.${datos.monto_restante}`;
  
  const fecha_pago = `Fecha: ${datos.fecha_pago}`;

  const estado = `Estado: ${datos.estado}                           Pago: ${datos.capital_pago}`;



  // Contenido del encabezado
  const encabezado = [
      [empresa],
  ];

  // Contenido del cuerpo
  const cuerpo = [
      [ruc],
      [nro_serie],
      [direccion], 
      [fecha_pago],
      [''],
      [cliente],
      [empleado],
      [''],
      [descripcion],
      [articulo],
      [estado],
      [''],
      [''],
      [''],
     
      [''],
      [''],
      ['                     Gracias por tu Preferencia¡'],
  ];

  // Configuración de la tabla
  const margintop = 1.1;
  const marginBottom = 0; // Margen inferior
  const marginleft = 0;
  const marginright = 0;

  // Obtener el ancho del código QR basado en su proporción
  const qrWidth = 1.4;
  const qrHeight = 1;

  // Ajustar las coordenadas del código QR para que aparezca en una esquina o en la parte inferior de la boleta
  const qrX = 0.8; // Coordenada X
  const qrY = 4.5; // Coordenada Y

  // Convertir la imagen a Base64
  const imgData = await this.getBase64ImageFromURL('/assets/img/login/gato.png');
  // doc1.addImage(imgData, 'PNG', 1.5, 0.2, 1.1, 1.1); // Ajusta las coordenadas (0.5, 0.5) y el tamaño de la imagen (3, 1)
  doc1.addImage(imgData, 'PNG', 0.9, 0, 1.1, 1);

  doc1.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrWidth, qrHeight);

  autoTable(doc1, {
      startY: margintop,
      head: encabezado ,
      body: cuerpo,

      styles: {
        fontSize: 8, // Tamaño de la letra de hoja
        halign: 'justify', // Alineación horizontal justificada
        textColor: [0, 0, 0] // Color del texto en RGB (negro)
    },
      theme: 'plain',
      tableWidth: doc1.internal.pageSize.width - 0.2 , // Ancho de la tabla
      margin: { // Adjust the margins
        top: margintop,
        bottom: marginBottom,
        left: marginleft + 0.1,
        right: marginright +0
    },


    didDrawCell: (data) => {
      if (data.section === 'body') {
          // Establecer color de los bordes
          doc1.setDrawColor(0); // Color negro
            // Dibujar borde superior
            if (data.row.index === 0) {
              // Si es la primera fila, no dibujar el borde superior
              doc1.setLineWidth(0);
          } else if (data.row.index === cuerpo.length - 1) {
              // Si es la última fila, no dibujar el borde inferior
              doc1.setLineWidth(0);
          } else if (data.row.index === 2 || data.row.index === 3) {
              // Si es la tercera o cuarta fila, no dibujar los bordes
              doc1.setLineWidth(0);
          } else if (data.row.index === 4|| data.row.index === 7) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else if ( data.row.index === 8 || data.row.index === 11 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          } 
          else if ( data.row.index === 12 || data.row.index === 13 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }
          else if ( data.row.index === 14 || data.row.index === 15 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else {
              // Si no es la primera ni la última fila, dibujar los bordes
              doc1.line(data.cell.x, data.cell.y, data.cell.x + data.cell.width, data.cell.y); // Borde superior
              doc1.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height); // Borde inferior
          }
      }
    }
  });



 // Guardar o mostrar el documento
    const hoy = new Date();
    doc1.save(entidad + "_" + hoy.getDate() + (hoy.getMonth()+1) + hoy.getFullYear()+ "_" + hoy.getTime() + '.pdf')


  }

   
// IMPRESION DE LA VENTA

async imprimirFilaVentas(entidad: string, datos: any) {
  const doc1 = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [2.9, 7.7],
  });


// Función para generar un número aleatorio de 4 dígitos
function generateRandomNumber() {
  return Math.floor(10000 + Math.random() * 90000); // Genera un número aleatorio entre 1000 y 9999
}

// Función para generar una cadena aleatoria de 5 caracteres
function generateRandomString(length) {
  const characters = '0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Generar el código QR único
const qrData = `Datos de la Venta: ${JSON.stringify(datos)}`;
const qrCodeDataURL = await QRCode.toDataURL(qrData);



// Genera un número de serie único
const nro_serie = `                           ${datos.serie}`;



  // Datos de la empresa
  const boleta ='          BOLETA DE VENTA ELECTRONICA ';
  const empresa = '               CASA DE EMPEÑOS DON GATO';
  const direccion = `Calle: Principal 123, Ciudad    Teléfono: 987654233`;
  const ruc =`                      R.U.C: 10785645876`;

  // Datos del préstamo
  const cliente = `Cliente: ${datos.cliente}`;
  const dni = `Dni: ${datos.dni}`;
  const empleado = `Empleado: ${datos.empleado} `;
  const descripcion = `Cantidad             Articulo                       Precio Unit` ;
  const articulo = `${datos.cantidad}                     ${datos.articulo}                         S/.${datos.precio_unitario}`;
  
  const fecha_venta = `Fecha de emision:                              ${datos.fecha_venta}`;

  const tipo_pago = `Tipo de Pago: ${datos.tipo_pago}         SubTotal:      S/.${datos.subtotal}`;               
 
  const IGV =`                                                    IGV:         S/.${datos.igv}`;
  const descuento =`                                 Total  Descuento:       S/.${datos.descuento}`;

  const total =`                                      Importe Toatl:     S/.${datos.total}`;


  // Contenido del encabezado
  const encabezado = [
    [empresa],
  ];

  // Contenido del cuerpo
  const cuerpo = [
      [direccion],
      [''],
      [boleta], 
      [ruc], 
      [nro_serie],
      [''],
      [fecha_venta],
      [empleado],
      [cliente],
      [dni],
      [''],
      [descripcion],
      [articulo],
      [tipo_pago],
      [IGV],
      [descuento],
      [total],

  
      [''],
      [''],
      [''],
      [''],
      [''],
      
      ['                     Gracias por tu Preferencia¡'],
  ];

  // Configuración de la tabla
  const margintop = 1.1;
  const marginBottom = 0; // Margen inferior
  const marginleft = 0;
  const marginright = 0;

  // Obtener el ancho del código QR basado en su proporción
  const qrWidth = 1.4;
  const qrHeight = 1;

  // Ajustar las coordenadas del código QR para que aparezca en una esquina o en la parte inferior de la boleta
  const qrX = 0.8; // Coordenada X
  const qrY = 6; // Coordenada Y

  // Convertir la imagen a Base64
  const imgData = await this.getBase64ImageFromURL('/assets/img/login/gato.png');
  // doc1.addImage(imgData, 'PNG', 1.5, 0.2, 1.1, 1.1); // Ajusta las coordenadas (0.5, 0.5) y el tamaño de la imagen (3, 1)
  doc1.addImage(imgData, 'PNG', 0.9, 0, 1.1, 1);

  doc1.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrWidth, qrHeight);

  autoTable(doc1, {
      startY: margintop,
      head: encabezado ,
      body: cuerpo,

      styles: {
        fontSize: 8, // Tamaño de la letra de hoja
        halign: 'justify', // Alineación horizontal justificada
        textColor: [0, 0, 0], // Color del texto en RGB (negro)

    },

      theme: 'plain',
      tableWidth: doc1.internal.pageSize.width - 0.2 , // Ancho de la tabla
      margin: { // Adjust the margins
        top: margintop,
        bottom: marginBottom,
        left: marginleft + 0.1,
        right: marginright +0
    },
    didParseCell: (data) => {
      if (data.row.index === 10) { // Cambia el índice a la fila que contiene 'descripcion'
        data.cell.styles.fontStyle = 'bold';
      }
    },

    didDrawCell: (data) => {
      if (data.section === 'body') {


          // Establecer color de los bordes
          doc1.setDrawColor(0); // Color negro
            // Dibujar borde superior
            if (data.row.index === 0) {
              // Si es la primera fila, no dibujar el borde superior
              doc1.setLineWidth(0);
          } else if (data.row.index === cuerpo.length - 1) {
              // Si es la última fila, no dibujar el borde inferior
              doc1.setLineWidth(0);
          } else if (data.row.index === 2 ) {
              // Si es la tercera o cuarta fila, no dibujar los bordes
              doc1.setLineWidth(-1);
          }else if (data.row.index === 3 || data.row.index === 4 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
        } else if (data.row.index === 6) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else if ( data.row.index === 7 || data.row.index === 8) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          } else if (data.row.index === 9  ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else if (data.row.index === 10 || data.row.index === 12) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }
        
          else if ( data.row.index === 14 || data.row.index === 15 || data.row.index === 13 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else if (data.row.index === 16 || data.row.index === 17 || data.row.index === 18) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else if ( data.row.index === 19 || data.row.index === 20) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else if ( data.row.index === 21 || data.row.index === 22) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else {
              // Si no es la primera ni la última fila, dibujar los bordes
              doc1.line(data.cell.x, data.cell.y, data.cell.x + data.cell.width, data.cell.y); // Borde superior
              doc1.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height); // Borde inferior
          }
      }
    }
  });



 // Guardar o mostrar el documento
    const hoy = new Date();
    doc1.save(entidad + "_" + hoy.getDate() + (hoy.getMonth()+1) + hoy.getFullYear()+ "_" + hoy.getTime() + '.pdf')


  }




}
