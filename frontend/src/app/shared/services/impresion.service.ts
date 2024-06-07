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
    format: [2.9, 6.4],
  });

  // Generar el código QR único
  const qrData = `Datos del préstamo: ${JSON.stringify(datos)}`;
  const qrCodeDataURL = await QRCode.toDataURL(qrData);

  // Genera un número de serie único
  const nro_serie = `                               ${datos.num_serie}`;

  // Datos de la empresa
  const empresa = '                 CASA DE EMPEÑOS DON GATO';
  const direccion = `   Teléfono: 987654233`;

  const prestamo = `          TICKET DE PRESTAMO ELECTRONICA`;
  const ruc = `                          R.U.C: 10785645876`;

  // Datos del préstamo
  const cliente = `Cliente:${datos.cliente}`;
  const dni = `Dni: ${datos.dni}`;
  const empleado = `                Empleado: ${datos.empleado} `;
  const descripcion = `Articulo                 Marca                     Modelo`;
  const articulo = `${datos.articulo}           ${datos.marca}             ${datos.modelo}`;

  const fechaPrestamo = `Fecha de Emision:                              ${datos.fechaPrestamo}`;
  const fechadevolucion = `Fecha de Devolucion:                         ${datos.fechaDevolucion}`;
  const estado = ` Prestamo                   Pagar                   Estado`;
  const pago = ` S/.${datos.montoPrestamo}                 S/.${datos.montoPago}               ${datos.estado}`;

  // Contenido del encabezado
  const encabezado = [
    [empresa],
  ];

  // Contenido del cuerpo
  const cuerpo = [
    ['                       Calle: Principal 123, Ciudad '],
    ['                           Teléfono: 987-654-233'],
    [''],
    [prestamo],
    [ruc],
    [nro_serie],
    ['__________________________________________'],
    [fechaPrestamo],
    [dni],
    [cliente],
    ['__________________________________________'],
    [descripcion],
    [articulo],
    ['__________________________________________'],
    [estado],
    [pago],
    ['__________________________________________'],
    ['                   Cronograma de Pagos'],
    ['Pago' + '            ' +'Fecha de Pago' + '           ' +'Monto Pagado'],
   
  ];

  let contador = 1;
datos.cronogramaPagos.forEach((item) => {
  cuerpo.push([ contador + '                       ' + item.fechaPago + '                    S/'+item.montoPagado]);
  contador++;
});
    cuerpo.push(['__________________________________________']);
    cuerpo.push([' EN CASO DE INCUMPLIMIENTO EN EL PAGO']);
    cuerpo.push(['    DEL PRÉSTAMO DENTRO DEL PLAZO ']);
    cuerpo.push(['ACORDADO EL BIEN SERÁ PUESTO EN VENTA']);
    cuerpo.push(['']);
    cuerpo.push([ empleado]);
    cuerpo.push(['']);
    cuerpo.push(['']);
    cuerpo.push(['']);
    cuerpo.push(['']);
    cuerpo.push(['']);
    cuerpo.push(['']);
    cuerpo.push(['']);
    cuerpo.push(['']);
    cuerpo.push(['']);
    cuerpo.push(['']);
    cuerpo.push(['                       Gracias por tu Preferencia¡']);

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
  doc1.addImage(imgData, 'PNG', 0.9, 0, 1.1, 1);

  doc1.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrWidth, qrHeight);

  autoTable(doc1, {
    startY: margintop,
    head: encabezado,
    body: cuerpo,
   
    styles: {
      fontSize: 8, // Tamaño de la letra de hoja
      cellPadding: -0, // Establece el padding en 0.1 inches
      
      halign: 'justify', // Alineación horizontal justificada
      textColor: [0, 0, 0] // Color del texto en RGB (negro)
    },
    theme: 'plain',
    tableWidth: doc1.internal.pageSize.width - 0.2, // Ancho de la tabla
    margin: { // Ajustar los márgenes
      top: margintop,
      bottom: marginBottom,
      left: marginleft + 0.1,
      right: marginright + 0
    },
    didParseCell: (data) => {
      if (data.row.index === 3) { // Cambia el índice a la fila que contiene 'descripcion'
        data.cell.styles.fontStyle = 'bold';
      } else if (data.row.index === 5 || data.row.index === 11 ) {
        data.cell.styles.fontStyle = 'bold';
      } else if (data.row.index === 14 || data.row.index === 22 || data.row.index === 23) {
        data.cell.styles.fontStyle = 'bold';
      } else if (data.row.index === 17 || data.row.index === 24 || data.row.index === 26) {
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
        } else if (data.row.index === 1) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 2 || data.row.index === 3) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 4 || data.row.index === 5) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 6 || data.row.index === 7) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 8 || data.row.index === 9 || data.row.index === 10) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 11 || data.row.index === 13) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 12 || data.row.index === 14) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 15 || data.row.index === 16) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 17) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if ( data.row.index === 18 || data.row.index === 19) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 20 ) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 21 ||data.row.index === 22) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
        } else if (data.row.index === 23 || data.row.index === 24 || data.row.index === 25) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
         } else if (data.row.index === 26 || data.row.index === 27 || data.row.index === 28) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
         }else if (data.row.index === 29 || data.row.index === 30 || data.row.index === 31)  {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
         }
         else if (data.row.index === 32 || data.row.index === 33 || data.row.index ===34 || data.row.index ===35) {
          // Si es la tercera o cuarta fila, no dibujar los bordes
          doc1.setLineWidth(0);
         }
         else if (data.row.index === 36 || data.row.index === 37 || data.row.index ===38 ) {
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
  doc1.save(entidad + "_" + hoy.getDate() + (hoy.getMonth() + 1) + hoy.getFullYear() + "_" + hoy.getTime() + '.pdf');
}

async getBase64ImageFromURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
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
  const uniqueNumber = new Date().getTime().toString();
  return uniqueNumber;
}

// IMPRESION DEL Pago

async imprimirFilaPagos(entidad: string, datos: any) {
  const doc1 = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [2.9, 5.5],
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
const nro_serie = `                            ${datos.num_serie}`;



  // Datos de la empresa
  const empresa = '               CASA DE EMPEÑOS DON GATO';
  const direccion = `Calle: Principal 123, Ciudad    Teléfono: 987654233`;
  const ruc =`                          R.U.C: 10785645876`;
  const pago = `              TICKET DE PAGO ELECTRONICO`
  // Datos del préstamo
  const cliente =`Cliente:${datos.cliente}`;
  const dni = `Dni: ${datos.dni}`;
   const empleado = `                Empleado: ${datos.empleado} `;
  const descripcion = `Articulo                    Marca                      Modelo` ;

  const articulo = `${datos.articulo}                      ${datos.marca}                     ${datos.modelo}`;
  
  const fecha_pago = `Fecha de Emicion:                       ${datos.fecha_pago}`;
const estado = `Interes                   Pagado                     Restante`;
  const pagado = `S/.${datos.interes_pago}                    S/.${datos.capital_pago}                  S/.${datos.monto_restante}`;
  const tipo_pago = `${datos.tipo_pago}`;
  // Contenido del encabezado
  const encabezado = [
      [empresa],
  ];

  // Contenido del cuerpo
  const cuerpo = [
       ['                       Calle: Principal 123, Ciudad '],
       ['                           Teléfono: 987-654-233'],
       [''],
      [pago],
      [ruc],
      [nro_serie],
      ['__________________________________________'],
      [fecha_pago],
      [dni],
      [cliente],
      ['__________________________________________'],
      [descripcion],
      [articulo],
      ['__________________________________________'],
      [estado],
      [pagado],
      ['__________________________________________'],
      ['Pago' + '              ' +'Monto Pagado' + '             ' +'Tipo Pago'],
  ];

  let contador = 1;
  datos.cronogramaPagos.forEach((item) => {
    cuerpo.push([contador + '                       S/.'+item.montoPagado + '                      ' + tipo_pago]);
    contador++;
  });
      cuerpo.push(['__________________________________________']);
      cuerpo.push([ empleado]);
      cuerpo.push(['']);
      cuerpo.push(['']);
      cuerpo.push(['']);
      cuerpo.push(['']);
      cuerpo.push(['']);
      cuerpo.push(['']);
      cuerpo.push(['']);
      cuerpo.push(['']);
      cuerpo.push(['']);
      cuerpo.push(['                       Gracias por tu Preferencia¡']);

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
  const qrY = 4.1; // Coordenada Y

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
        cellPadding: -0, // Establece el padding en 0.1 inches
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
    didParseCell: (data) => {
      if (data.row.index === 5  || data.row.index === 11) { // Cambia el índice a la fila que contiene 'descripcion'
        data.cell.styles.fontStyle = 'bold';
      }
      else if (data.row.index === 3) {
        data.cell.styles.fontStyle = 'bold';
    } 
    else if (data.row.index === 14 || data.row.index === 17 || data.row.index === 21) {
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
            } else if (data.row.index === 1 || data.row.index === 2 || data.row.index === 3) {
              // Si es la tercera o cuarta fila, no dibujar los bordes
              doc1.setLineWidth(0);
          } else if (data.row.index === 4 || data.row.index === 5 || data.row.index === 6 ) {
              // Si es la tercera o cuarta fila, no dibujar los bordes
              doc1.setLineWidth(0);
          } else if (data.row.index === 7|| data.row.index === 8 || data.row.index === 9) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          } else if (data.row.index === 10|| data.row.index === 11 || data.row.index === 12) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
            
          }else if ( data.row.index === 13 || data.row.index === 14 || data.row.index === 15) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          } 
          else if ( data.row.index === 16 || data.row.index === 17 || data.row.index === 18) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }
          else if ( data.row.index === 19 || data.row.index === 20 || data.row.index === 21) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }
          else if ( data.row.index === 22 || data.row.index === 23 || data.row.index === 24 ) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }
          else if ( data.row.index === 25 || data.row.index === 26 || data.row.index === 27) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }
          else if ( data.row.index === 28 || data.row.index === 29 || data.row.index === 30) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }
          else if ( data.row.index === 31 || data.row.index === 32 || data.row.index === 33) {
            // Si es la tercera o cuarta fila, no dibujar los bordes
            doc1.setLineWidth(0);
          }else if ( data.row.index === 34 || data.row.index === 35 || data.row.index === 36) {
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

   
// IMPRESION DE LA VENTA BOLETA
async imprimirFilaVentas(entidad: string, datos: any) {
  const doc1 = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [2.9, 8.2],
  });

  // Generar el código QR único
  const qrData = `Datos de la Venta: ${JSON.stringify(datos,)}`;
  const qrCodeDataURL = await QRCode.toDataURL(qrData);

  // Genera un número de serie único
  const nro_serie = `                           ${datos.serie}`;

  const tipo_comprobante = `${datos.tipo_comprobante}`;
  let boleta_factura = tipo_comprobante === 'boleta' ? '          BOLETA DE VENTA ELECTRONICA ' : '          FACTURA DE VENTA ELECTRONICA ';

  // Datos de la empresa
  const empresa = '               CASA DE EMPEÑOS DON GATO';
  const direccion = `Calle: Principal 123, Ciudad    Teléfono: 987654233`;
  const ruc = `                      R.U.C: 10785645876`;

  // Datos del préstamo
  const cliente = `Cliente: ${datos.cliente}`;
  const dni = `Dni: ${datos.dni}`;
  const empleado = `                  Empleado: ${datos.empleado} `;
  const descripcion = `Articulo                 CANT.  P.U  SUBTOTAL`;
  const articulos = Array.isArray(datos.detalleventa) ? datos.detalleventa : [];

  const fecha_venta = `Fecha de emision:  ${datos.fecha_venta}`;
  const tipo_pago = `Tipo de Pago     `;
  const IGV = `                                                    IGV:         S/.${datos.igv}`;
  const descuento = `                                 Total  Descuento:       S/.${datos.descuento}`;
  const total = `                                      Importe Total:     S/.${datos.total}`;

  // Contenido del encabezado
  const encabezado = [
    [empresa],
  ];

  // Contenido del cuerpo
  const cuerpo = [
    [direccion],
    [boleta_factura],
    [ruc],
    [nro_serie],
    ['__________________________________________'],
    [fecha_venta],
    [dni],
    [cliente],
    [''],
    [descripcion],
  ];

  // Añadir artículos al cuerpo
  articulos.forEach(detalle => {
    cuerpo.push([`${detalle.descripcion + " "+detalle.modelo + " " +detalle.marca}` + "      " + `${detalle.cantidad}` + "   "+ `${detalle.precio_unitario}` + "   " +`${detalle.subtotal}`]);
  });

  cuerpo.push(
    ['__________________________________________'],
    [tipo_pago],
    [`${datos.tipo_pago}`],
    [IGV],
    [descuento],
    [total],
    [''],
    [empleado],
    [''],
   
    ['                     Gracias por tu Preferencia¡'],
  );

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
  const qrY = 6.7; // Coordenada Y

 // Convertir la imagen a Base64
 const imgData = await this.getBase64ImageFromURL('/assets/img/login/gato.png');
 doc1.addImage(imgData, 'PNG', 0.9, 0, 1.1, 1);
 doc1.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrWidth, qrHeight);

 autoTable(doc1, {
   startY: margintop,
   head: encabezado,
   body: cuerpo,

   styles: {
     fontSize: 8, // Tamaño de la letra de hoja
     halign: 'justify', // Alineación horizontal justificada
     cellPadding: -0, // Establece el padding en 0.1 inches
     textColor: [0, 0, 0], // Color del texto en RGB (negro)
   },

   theme: 'plain',
   tableWidth: doc1.internal.pageSize.width - 0.2, // Ancho de la tabla
   margin: {
     top: margintop,
     bottom: marginBottom,
     left: marginleft + 0.1,
     right: marginright + 0,
   },
   didParseCell: (data) => {
     if (data.row.index === 9) { // Cambia el índice a la fila que contiene 'descripcion'
       data.cell.styles.fontStyle = 'bold';
     }
   },
 });

  // Guardar o mostrar el documento
  const hoy = new Date();
  doc1.save(`${entidad}_${hoy.getDate()}${hoy.getMonth() + 1}${hoy.getFullYear()}_${hoy.getTime()}.pdf`);
}





// IMPRESION DE LA VENTA FACTURA
async imprimirFilaVentasF(entidad: string, datos: any) {
  const doc1 = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [2.9, 8.2],
  });

  // Generar el código QR único
  const qrData = `Datos de la Venta: ${JSON.stringify(datos,)}`;
  const qrCodeDataURL = await QRCode.toDataURL(qrData);

  // Genera un número de serie único
  const nro_serie = `                           ${datos.serie}`;

  const tipo_comprobante = `${datos.tipo_comprobante}`;
  let boleta_factura = tipo_comprobante === 'boleta' ? '          BOLETA DE VENTA ELECTRONICA ' : '          FACTURA DE VENTA ELECTRONICA ';

  // Datos de la empresa
  const empresa = '               CASA DE EMPEÑOS DON GATO';
  const direccion = `Calle: Principal 123, Ciudad    Teléfono: 987654233`;
  const ruc = `                      R.U.C: 10785645876`;

  // Datos del préstamo
  const cliente = `Cliente: ${datos.razon_social}`;
  const ruccliente = `RUC: ${datos.ruc}`;
  const empleado = `                  Empleado: ${datos.empleado} `;
  const descripcion = `Articulo                 CANT.  P.U  SUBTOTAL`;
  const articulos = Array.isArray(datos.detalleventa) ? datos.detalleventa : [];

  const fecha_venta = `Fecha de emision:  ${datos.fecha_venta}`;
  const tipo_pago = `Tipo de Pago     `;
  const IGV = `                                                    IGV:         S/.${datos.igv}`;
  const descuento = `                                 Total  Descuento:       S/.${datos.descuento}`;
  const total = `                                      Importe Total:     S/.${datos.total}`;

  // Contenido del encabezado
  const encabezado = [
    [empresa],
  ];

  // Contenido del cuerpo
  const cuerpo = [
    [direccion],
    [boleta_factura],
    [ruc],
    [nro_serie],
    ['__________________________________________'],
    [fecha_venta],
    [ruccliente],
    [cliente],
    [''],
    [descripcion],
  ];

  // Añadir artículos al cuerpo
  articulos.forEach(detalle => {
    cuerpo.push([`${detalle.descripcion + " "+detalle.modelo + " " +detalle.marca}` + "      " + `${detalle.cantidad}` + "   "+ `${detalle.precio_unitario}` + "   " +`${detalle.subtotal}`]);
  });

  cuerpo.push(
    ['__________________________________________'],
    [tipo_pago],
    [`${datos.tipo_pago}`],
    [IGV],
    [descuento],
    [total],
    [''],
    [empleado],
    [''],
    [''],
    [''],
    [''],
    ['                     Gracias por tu Preferencia¡'],
  );

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
  const qrY = 6.7; // Coordenada Y

 // Convertir la imagen a Base64
 const imgData = await this.getBase64ImageFromURL('/assets/img/login/gato.png');
 doc1.addImage(imgData, 'PNG', 0.9, 0, 1.1, 1);
 doc1.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrWidth, qrHeight);

 autoTable(doc1, {
   startY: margintop,
   head: encabezado,
   body: cuerpo,

   styles: {
     fontSize: 8, // Tamaño de la letra de hoja
     halign: 'justify', // Alineación horizontal justificada
   
     textColor: [0, 0, 0], // Color del texto en RGB (negro)
   },

   theme: 'plain',
   tableWidth: doc1.internal.pageSize.width - 0.2, // Ancho de la tabla
   margin: {
     top: margintop,
     bottom: marginBottom,
     left: marginleft + 0.1,
     right: marginright + 0,
   },
   didParseCell: (data) => {
     if (data.row.index === 5  || data.row.index === 11) { // Cambia el índice a la fila que contiene 'descripcion'
       data.cell.styles.fontStyle = 'bold';
     }
     else if (data.row.index === 3) {
       data.cell.styles.fontStyle = 'bold';
   } 
   else if (data.row.index === 14 || data.row.index === 17 || data.row.index === 21) {
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
           } else if (data.row.index === 1 || data.row.index === 2 || data.row.index === 3) {
             // Si es la tercera o cuarta fila, no dibujar los bordes
             doc1.setLineWidth(0);
         } else if (data.row.index === 4 || data.row.index === 5 || data.row.index === 6 ) {
             // Si es la tercera o cuarta fila, no dibujar los bordes
             doc1.setLineWidth(0);
         } else if (data.row.index === 7|| data.row.index === 8 || data.row.index === 9) {
           // Si es la tercera o cuarta fila, no dibujar los bordes
           doc1.setLineWidth(0);
         } else if (data.row.index === 10|| data.row.index === 11 || data.row.index === 12) {
           // Si es la tercera o cuarta fila, no dibujar los bordes
           doc1.setLineWidth(0);
           
         }else if ( data.row.index === 13 || data.row.index === 14 || data.row.index === 15) {
           // Si es la tercera o cuarta fila, no dibujar los bordes
           doc1.setLineWidth(0);
         } 
         else if ( data.row.index === 16 || data.row.index === 17 || data.row.index === 18) {
           // Si es la tercera o cuarta fila, no dibujar los bordes
           doc1.setLineWidth(0);
         }
         else if ( data.row.index === 19 || data.row.index === 20 || data.row.index === 21) {
           // Si es la tercera o cuarta fila, no dibujar los bordes
           doc1.setLineWidth(0);
         }
         else if ( data.row.index === 22 || data.row.index === 23 || data.row.index === 24 ) {
           // Si es la tercera o cuarta fila, no dibujar los bordes
           doc1.setLineWidth(0);
         }
         else if ( data.row.index === 25 || data.row.index === 26 || data.row.index === 27) {
           // Si es la tercera o cuarta fila, no dibujar los bordes
           doc1.setLineWidth(0);
         }
         else if ( data.row.index === 28 || data.row.index === 29 || data.row.index === 30) {
           // Si es la tercera o cuarta fila, no dibujar los bordes
           doc1.setLineWidth(0);
         }
         else if ( data.row.index === 31 || data.row.index === 32 || data.row.index === 33) {
           // Si es la tercera o cuarta fila, no dibujar los bordes
           doc1.setLineWidth(0);
         }else if ( data.row.index === 34 || data.row.index === 35 || data.row.index === 36) {
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
  doc1.save(`${entidad}_${hoy.getDate()}${hoy.getMonth() + 1}${hoy.getFullYear()}_${hoy.getTime()}.pdf`);
}





}
