const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

/**
 * Configuración de Nodemailer para envío de emails
 * Usando Gmail SMTP
 */

// Crear transportador
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Contraseña de aplicación de Gmail
  }
});

/**
 * Enviar email genérico
 */
const enviarEmail = async (opciones) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: opciones.to,
      subject: opciones.subject,
      html: opciones.html || opciones.text,
      attachments: opciones.attachments || []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Notificar nueva visita al anfitrión
 */
const notificarNuevaVisita = async (visita, anfitrion) => {
  console.log("🚀 ~ 37 ~ notificarNuevaVisita ~ visita:", visita, anfitrion)
  const html = `
    <h2>Nueva Visita Programada</h2>
    <p>Hola ${anfitrion.nombre} ${anfitrion.apellido},</p>
    <p>Se ha registrado una nueva visita:</p>
    <ul>
      <li><strong>Visitante:</strong> ${visita.visitante_nombre} ${visita.visitante_apellido}</li>
      <li><strong>Empresa:</strong> ${visita.empresa || 'N/A'}</li>
      <li><strong>Motivo:</strong> ${visita.motivo}</li>
      <li><strong>Fecha y hora:</strong> ${visita.inicio}</li>
    </ul>
    <p>Por favor, confirma tu disponibilidad.</p>
  `;

  return await enviarEmail({
    to: anfitrion.email,
    subject: 'Nueva Visita Programada',
    html
  });
};

/**
 * Notificar check-in al anfitrión
 */
const notificarCheckIn = async (visita, anfitrion) => {
  const html = `
    <h2>Visitante ha Llegado</h2>
    <p>Hola ${anfitrion.nombre} ${anfitrion.apellido},</p>
    <p>Tu visitante ha llegado:</p>
    <ul>
      <li><strong>Visitante:</strong> ${visita.visitante_nombre} ${visita.visitante_apellido}</li>
      <li><strong>Hora de llegada:</strong> ${visita.check_in}</li>
    </ul>
    <p>Se encuentra en recepción esperando.</p>
  `;

  return await enviarEmail({
    to: anfitrion.email,
    subject: 'Tu Visitante ha Llegado',
    html
  });
};

/**
 * Enviar recordatorio de visita
 */
const enviarRecordatorioVisita = async (visita, destinatario) => {
  const html = `
    <h2>Recordatorio de Visita</h2>
    <p>Hola ${destinatario.nombre},</p>
    <p>Te recordamos tu visita programada para:</p>
    <ul>
      <li><strong>Fecha y hora:</strong> ${visita.inicio}</li>
      <li><strong>Anfitrión:</strong> ${visita.anfitrion_nombre} ${visita.anfitrion_apellido}</li>
      <li><strong>Motivo:</strong> ${visita.motivo}</li>
    </ul>
  `;

  return await enviarEmail({
    to: destinatario.email,
    subject: 'Recordatorio de Visita',
    html
  });
};

/**
 * Confirmar visita al visitante
 */
const confirmarVisitaAlVisitante = async (visita, visitante, anfitrion) => {
  console.log("🚀 ~ confirmarVisitaAlVisitante ~ visita, visitante, anfitrion:", visita, visitante, anfitrion)
  const fechaInicio = new Date(visita.inicio);
  const fechaFin = new Date(visita.fin);
  
  // Generar QR con el DNI del visitante como buffer (adjunto)
  const qrBuffer = await QRCode.toBuffer(visitante.dni.toString(), {
    errorCorrectionLevel: 'M',
    type: 'png',
    width: 300,
    margin: 2
  });
  
  const html = `
    <h2>✅ Visita Confirmada</h2>
    <p>Hola ${visitante.nombre} ${visitante.apellido},</p>
    <p>Su visita ha sido registrada exitosamente.</p>
    
    <h3>Detalles de su visita:</h3>
    <ul>
      <li><strong>DNI:</strong> ${visitante.dni}</li>
      <li><strong>Fecha:</strong> ${fechaInicio.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
      <li><strong>Hora de inicio:</strong> ${fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</li>
      <li><strong>Hora de fin:</strong> ${fechaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</li>
      <li><strong>Anfitrión:</strong> ${anfitrion.nombre} ${anfitrion.apellido}</li>
      <li><strong>Motfrfrfrfivo:</strong> ${visita.motivo}</li>
    </ul>
    
    <div style="text-align: center; margin: 20px 0;">
      <h3>Código QR de Identificación</h3>
      <img src="cid:qrcode" alt="QR DNI" style="border: 2px solid #333; padding: 10px; background: white; width: 300px; height: 300px;"/>
      <p style="font-size: 12px; color: #666;">Presente este código QR en recepción</p>
    </div>
    
    <h3>Instrucciones:</h3>
    <p>Por favor, presentarse en recepción a la hora indicada con su documento de identidad.</p>
    <p>Puede mostrar este código QR en recepción para agilizar su registro.</p>
    <p>Al llegar, el personal de seguridad registrará su ingreso y notificará a su anfitrión.</p>
    
    <p><em>Si necesita cancelar o modificar su visita, por favor contacte a su anfitrión.</em></p>
    
    <p>¡Gracias!</p>
  `;

  return await enviarEmail({
    to: visitante.email,
    subject: '✅ Confirmación de Visita',
    html,
    attachments: [
      {
        filename: 'qr-visita.png',
        content: qrBuffer,
        cid: 'qrcode' // Content ID para referenciar en el HTML con src="cid:qrcode"
      }
    ]
  });
};

/**
 * Notificar cancelación de visita
 */
const notificarCancelacion = async (visita, destinatario, motivo) => {
  const html = `
    <h2>Visita Cancelada</h2>
    <p>Hola ${destinatario.nombre},</p>
    <p>La siguiente visita ha sido cancelada:</p>
    <ul>
      <li><strong>Fecha y hora:</strong> ${visita.inicio}</li>
      <li><strong>Motivo de cancelación:</strong> ${motivo || 'No especificado'}</li>
    </ul>
    <p>Disculpa las molestias.</p>
  `;

  return await enviarEmail({
    to: destinatario.email,
    subject: 'Visita Cancelada',
    html
  });
};

module.exports = {
  enviarEmail,
  notificarNuevaVisita,
  confirmarVisitaAlVisitante,
  notificarCheckIn,
  enviarRecordatorioVisita,
  notificarCancelacion
};
