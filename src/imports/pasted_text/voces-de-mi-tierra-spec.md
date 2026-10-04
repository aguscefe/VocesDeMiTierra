Crea una aplicación web responsive, funcional y navegable llamada “Voces de mi Tierra”. Debe ser un prototipo de alta fidelidad para la Etapa Regional de InnovaTecNM, orientado a la comercialización digital asistida de artesanías de comunidades originarias de Quintana Roo.

La aplicación debe permitir que las personas artesanas publiquen y vendan sus piezas, que los consumidores conozcan la autoría y procedencia cultural de los productos y que los administradores supervisen usuarios, publicaciones, pedidos, pagos simulados, autorizaciones y estadísticas.

IMPORTANTE

* No crear únicamente pantallas estáticas: implementar navegación, formularios, filtros, estados, validaciones, cálculos y datos persistentes.
* Utilizar datos de demostración claramente identificados como “Datos de prueba”.
* Los pagos deben funcionar exclusivamente en modo sandbox; nunca solicitar ni procesar información bancaria real.
* No afirmar que la plataforma certifica la autenticidad de una pieza. Utilizar “procedencia declarada y autorizada por el productor”.
* No inventar traducciones al maya. Preparar la interfaz para español y maya, pero utilizar la etiqueta “Contenido en maya pendiente de validación” cuando no exista una traducción autorizada.
* Todo el acompañamiento debe ser digital. No incluir visitas, recolección de piezas, inventario propio ni sesiones fotográficas presenciales.
* La plataforma no asume la fabricación de los productos.
* El productor será responsable de preparar el paquete y registrar la guía de envío.
* El comprador pagará el producto y el envío.
* La plataforma retendrá una comisión simulada del 10 % sobre el precio del producto.
* El costo de procesamiento sandbox será 3.6 % más $3.00, mostrado únicamente en estadísticas administrativas y cálculos internos.
* El productor recibirá el 90 % del precio de la pieza.
* Mostrar siempre montos en pesos mexicanos, MXN.

IDENTIDAD VISUAL

Diseñar una interfaz profesional, contemporánea, cálida y culturalmente respetuosa.

Paleta sugerida:

* Terracota principal: #B85C38
* Verde selva: #315C4C
* Arena clara: #F5EFE4
* Crema: #FFFDF8
* Amarillo maíz: #D6A73C
* Café oscuro: #3A2923
* Texto principal: #25211F
* Gris secundario: #6B6763
* Éxito: #2F7D50
* Advertencia: #D18B24
* Error: #B33A3A

Usar tipografías legibles, tarjetas limpias, fotografías grandes, bordes suavemente redondeados y sombras discretas. Evitar saturar la interfaz con grecas o elementos culturales genéricos. Los patrones decorativos deben ser mínimos y no atribuirse a una comunidad específica sin autorización.

Diseño mobile first con adaptación completa a computadora y tableta. Cumplir criterios WCAG AA: contraste suficiente, navegación por teclado, etiquetas en campos, textos alternativos y estados que no dependan solamente del color.

ROLES Y CUENTAS DE PRUEBA

Crear tres roles:

1. Consumidor.
2. Productor o representante autorizado.
3. Administrador.

Cuentas de demostración:

* Consumidor:
  correo: [consumidor@vocesdemo.mx](mailto:consumidor@vocesdemo.mx)
  contraseña: Demo1234

* Productor:
  correo: [productor@vocesdemo.mx](mailto:productor@vocesdemo.mx)
  contraseña: Demo1234

* Administrador:
  correo: [admin@vocesdemo.mx](mailto:admin@vocesdemo.mx)
  contraseña: Demo1234

Agregar botones rápidos en la pantalla de acceso:

* Entrar como consumidor.
* Entrar como productor.
* Entrar como administrador.

Mostrar una etiqueta visible: “Entorno de demostración regional”.

ARQUITECTURA DE DATOS

Si Figma Make permite utilizar Supabase o una base de datos integrada, crear las siguientes colecciones o tablas. Si no está disponible, construir una base simulada con objetos JSON y persistencia mediante localStorage. Separar la capa de datos para que posteriormente pueda reemplazarse por una API Laravel con MariaDB.

Entidades:

1. users

* id
* name
* email
* password_demo
* role: consumer, producer, admin
* phone
* status
* created_at
* last_login

2. producer_profiles

* id
* user_id
* workshop_name
* biography
* community
* municipality
* languages
* craft_types
* years_experience
* profile_image
* authorization_status
* represented_by
* verified_contact

3. products

* id
* producer_id
* name
* category
* description
* price
* stock
* status: draft, pending, published, paused, rejected
* materials
* technique
* production_time
* package_weight
* package_dimensions
* featured_image
* gallery
* created_at
* updated_at

4. cultural_records

* id
* product_id
* community_origin
* author_name
* cultural_description
* process
* authorized_text
* audio_url
* maya_content_status
* consent_id
* disclaimer

5. consents

* id
* producer_id
* product_id
* content_types
* purpose
* publication_channels
* start_date
* expiration_date
* withdrawal_status
* accepted_at

6. qr_codes

* id
* product_id
* public_url
* scans
* last_scan
* active

7. favorites

* id
* consumer_id
* product_id
* created_at

8. carts

* id
* consumer_id
* items
* subtotal
* shipping
* total

9. orders

* id
* order_number
* consumer_id
* producer_id
* status: pending_payment, paid, preparing, shipped, delivered, cancelled, return_requested, refunded
* subtotal
* shipping
* total
* platform_commission
* producer_net
* processing_cost
* created_at
* estimated_delivery

10. order_items

* id
* order_id
* product_id
* quantity
* unit_price

11. payments_sandbox

* id
* order_id
* sandbox_transaction_id
* method
* status: pending, approved, declined, refunded
* amount
* card_last_four
* simulated
* created_at

12. shipments

* id
* order_id
* carrier
* tracking_number
* shipping_cost
* estimated_date
* shipped_at
* delivered_at
* tracking_events

13. reviews

* id
* order_id
* consumer_id
* product_id
* rating
* comment
* status

14. notifications

* id
* user_id
* type
* title
* message
* read
* created_at

15. support_tickets

* id
* user_id
* order_id
* subject
* description
* status
* priority
* created_at

16. analytics_events

* id
* user_id
* product_id
* event_type: product_view, qr_scan, favorite, add_to_cart, checkout_started, purchase_completed
* source
* created_at

DATOS DE DEMOSTRACIÓN

Precargar al menos:

* 8 perfiles de productores.
* 20 productos artesanales.
* 40 consumidores ficticios agregados en estadísticas.
* 25 pedidos históricos.
* 5 pedidos activos.
* 10 códigos QR.
* 8 reseñas.
* 5 solicitudes de soporte.
* Datos mensuales de seis meses para gráficas.

Categorías:

* Textiles y bordados.
* Madera.
* Fibras naturales.
* Cerámica.
* Joyería artesanal.
* Decoración.
* Accesorios.

Comunidades o zonas de referencia:

* Felipe Carrillo Puerto.
* José María Morelos.
* Tulum.
* Bacalar.
* Lázaro Cárdenas.
* Benito Juárez.
* Cozumel.

Los nombres, fotografías, historias y perfiles serán ficticios y deberán mostrar una etiqueta interna de “Dato de demostración”. No utilizar nombres reales ni atribuir relatos culturales inventados a una comunidad.

NAVEGACIÓN PÚBLICA

Crear las siguientes rutas:

* /
* /catalogo
* /producto/:id
* /productor/:id
* /como-funciona
* /trazabilidad
* /quienes-somos
* /preguntas-frecuentes
* /contacto
* /privacidad
* /terminos
* /envios-devoluciones
* /login
* /registro

ENCABEZADO PÚBLICO

Incluir:

* Logotipo y nombre Voces de mi Tierra.
* Inicio.
* Catálogo.
* Productores.
* Cómo funciona.
* Trazabilidad cultural.
* Campo de búsqueda.
* Favoritos.
* Carrito.
* Iniciar sesión.
* Botón “Quiero vender”.
* Selector Español/Maya.
* Menú responsive.

PÁGINA DE INICIO

Incluir:

1. Hero principal:

* Título: “Conoce las manos, el origen y la historia detrás de cada pieza”.
* Texto breve sobre compra directa y procedencia cultural.
* Botones “Explorar artesanías” y “Quiero vender”.

2. Artesanías destacadas.

3. Categorías.

4. Productores destacados.

5. Explicación en tres pasos:

* Descubre.
* Conoce su procedencia.
* Compra directamente.

6. Sección del código QR:

* Explicar que conecta una pieza física con su ficha digital.
* Botón “Probar un QR de demostración”.

7. Beneficios:

* Reconocimiento del productor.
* Información cultural autorizada.
* Publicación asistida.
* Compra y seguimiento digital.

8. Llamado final.

CATÁLOGO

Mostrar cuadrícula responsive con:

* Fotografía.
* Nombre.
* Precio.
* Productor.
* Comunidad de origen.
* Categoría.
* Disponibilidad.
* Botón de favorito.
* Etiqueta “Procedencia declarada”.
* Botón “Ver pieza”.

Filtros:

* Búsqueda por nombre.
* Categoría.
* Municipio o comunidad.
* Productor.
* Material.
* Técnica.
* Precio mínimo y máximo.
* Disponible.
* Ordenar por reciente, precio y popularidad.

Mostrar estados vacíos, carga, error y botón para limpiar filtros.

FICHA DEL PRODUCTO

Incluir:

* Galería de imágenes.
* Nombre y precio.
* Existencias.
* Productor y taller.
* Comunidad de origen.
* Técnica.
* Materiales.
* Proceso de elaboración.
* Tiempo estimado de elaboración.
* Historia cultural autorizada.
* Audio, cuando exista.
* Aviso: “Información declarada y autorizada por el productor. No constituye una certificación oficial de autenticidad”.
* Código QR.
* Número de consultas y escaneos, solo cuando corresponda.
* Selector de cantidad.
* Cálculo de envío mediante código postal simulado.
* Fecha estimada.
* Botón “Agregar al carrito”.
* Botón “Comprar ahora”.
* Favoritos.
* Política de devolución.
* Productos relacionados.
* Perfil del productor.

PERFIL PÚBLICO DEL PRODUCTOR

Mostrar:

* Nombre o taller.
* Fotografía autorizada.
* Comunidad y municipio.
* Biografía.
* Años de experiencia.
* Técnicas.
* Materiales.
* Idiomas.
* Catálogo disponible.
* Número de piezas publicadas.
* Valoración.
* Botón para compartir.

REGISTRO DEL PRODUCTOR

Crear formulario asistido por pasos:

1. Datos personales.
2. Taller o colectivo.
3. Comunidad y municipio.
4. Actividad artesanal.
5. Experiencia digital.
6. Representación autorizada.
7. Autorización de datos.
8. Revisión y envío.

Agregar barra de progreso, guardado como borrador, ayuda contextual, iconos, ejemplos y opción para que un familiar o representante administre el perfil.

PUBLICACIÓN ASISTIDA

Crear un flujo de ocho pasos:

1. Información básica.
2. Fotografías.
3. Categoría y materiales.
4. Técnica y proceso.
5. Procedencia cultural.
6. Precio, inventario y envío.
7. Consentimiento cultural.
8. Vista previa y publicación.

En fotografías mostrar una guía:

* Utiliza luz natural.
* Fondo limpio.
* Fotografía frente, reverso y detalles.
* Evita filtros que alteren colores.
* Confirma que la imagen está enfocada.

Permitir cargar, eliminar, ordenar, recortar y previsualizar imágenes.

En precio mostrar cálculo automático:

Ejemplo:

* Precio de venta: $800.00.
* Comisión de plataforma, 10 %: $80.00.
* Monto estimado para el productor: $720.00.

No restar el envío de la ganancia del productor.

CONSENTIMIENTO CULTURAL

Incluir casillas independientes para autorizar:

* Nombre del productor.
* Comunidad de origen.
* Fotografías.
* Técnica.
* Materiales.
* Historia de la pieza.
* Audio.
* Publicación en la plataforma.
* Uso del QR.
* Difusión en redes.

Permitir establecer vigencia y solicitar retiro posterior. No permitir publicar una ficha cultural sin consentimiento.

CARRITO Y CHECKOUT

Carrito:

* Producto.
* Productor.
* Cantidad.
* Precio.
* Envío.
* Subtotal.
* Total.
* Eliminar o modificar.
* Continuar comprando.
* Proceder al pago.

Checkout:

1. Datos del comprador.
2. Dirección.
3. Código postal.
4. Cotización de envío simulada.
5. Resumen del pedido.
6. Política de devolución.
7. Pago sandbox.
8. Confirmación.

PAGO SANDBOX

Crear un entorno visual claramente identificado:

“Pago de demostración. No se realizará ningún cargo real”.

Permitir seleccionar:

* Tarjeta de crédito o débito de prueba.
* Transferencia simulada.
* Pago pendiente simulado.

Tarjetas de prueba:

* Pago aprobado: 4242 4242 4242 4242.
* Pago rechazado: 4000 0000 0000 0002.
* Cualquier fecha futura.
* Cualquier CVC de tres dígitos.

No almacenar el número completo. Guardar únicamente últimos cuatro dígitos y estado simulado.

Simular:

* Procesando.
* Pago aprobado.
* Pago rechazado.
* Reintentar.
* Pedido creado.
* Comprobante sandbox.

Generar identificadores como:
SBX-VMT-2026-0001.

Cálculos internos para una pieza de $800:

* Precio: $800.
* Comisión: $80.
* Neto del productor: $720.
* Procesamiento estimado: $31.80 sin IVA.
* Margen preliminar: $48.20.

El comprador solamente verá producto, envío y total. El productor verá precio, comisión y neto. El administrador verá todos los conceptos.

PANEL DEL CONSUMIDOR

Menú:

* Resumen.
* Mis pedidos.
* Seguimiento.
* Favoritos.
* Productores seguidos.
* Mis reseñas.
* Estadísticas.
* Notificaciones.
* Soporte.
* Perfil y direcciones.

Resumen:

* Pedido activo.
* Última compra.
* Favoritos.
* Recomendaciones.
* Historial reciente.

Estadísticas del consumidor:

* Total de compras realizadas.
* Importe acumulado.
* Artesanos apoyados.
* Comunidades de origen presentes en sus compras.
* Categoría más comprada.
* Productos favoritos.
* Pedidos entregados.
* Pedidos en tránsito.
* QR escaneados.
* Compras por mes.
* Distribución por categoría.
* Línea de tiempo de descubrimientos culturales.

Utilizar gráficas sencillas y accesibles. No mostrar información privada de otros usuarios.

PANEL DEL PRODUCTOR

Menú:

* Resumen.
* Productos.
* Nueva publicación.
* Pedidos.
* Envíos.
* Ingresos.
* Códigos QR.
* Estadísticas.
* Consentimientos.
* Notificaciones.
* Soporte.
* Mi perfil.

Resumen:

* Ventas del mes.
* Monto bruto.
* Comisión.
* Monto neto.
* Pedidos pendientes.
* Productos activos.
* Bajo inventario.
* Escaneos QR.
* Accesos rápidos.

Estadísticas del productor:

* Ventas por día, semana, mes y periodo personalizado.
* Ingreso bruto.
* Comisión del 10 %.
* Monto neto.
* Ticket promedio.
* Número de pedidos.
* Productos vistos.
* Escaneos de QR.
* Favoritos recibidos.
* Productos agregados al carrito.
* Conversión de visitas a compras.
* Productos más vendidos.
* Productos más consultados.
* Ventas por categoría.
* Ventas por municipio del comprador, sin mostrar datos personales.
* Estado de pedidos.
* Inventario y productos con pocas existencias.
* Comparación con el periodo anterior.

Agregar filtros por fecha, producto, categoría y estado. Permitir descargar un reporte CSV simulado.

PANEL DEL ADMINISTRADOR

Menú:

* Resumen general.
* Usuarios.
* Productores.
* Consumidores.
* Productos.
* Revisión de publicaciones.
* Autorizaciones culturales.
* Pedidos.
* Pagos sandbox.
* Envíos.
* Comisiones.
* Estadísticas.
* Incidencias.
* Soporte.
* Configuración.
* Bitácora.

Funciones:

* Aprobar, rechazar o solicitar correcciones.
* Suspender productos.
* Activar o desactivar usuarios.
* Revisar consentimientos.
* Consultar pedidos.
* Cambiar estados en modo demostración.
* Procesar reembolsos simulados.
* Revisar incidencias.
* Exportar reportes.
* Consultar bitácora de acciones.

Estadísticas administrativas:

* Valor bruto de productos vendidos.
* Comisión bruta del 10 %.
* Costo estimado de procesamiento.
* Margen preliminar.
* Ventas por mes.
* Ticket promedio.
* Pedidos totales.
* Pedidos completados.
* Cancelaciones.
* Solicitudes de devolución.
* Tasa de incidencias.
* Productores registrados.
* Productores activos.
* Consumidores registrados.
* Compradores activos.
* Productos publicados.
* Productos pendientes.
* Productos rechazados.
* QR generados.
* QR escaneados.
* Conversión del catálogo.
* Abandono del carrito.
* Compradores recurrentes.
* Tiempo promedio de respuesta.
* Ventas por categoría.
* Ventas por municipio.
* Embudo: visita, ficha, carrito, checkout y compra.
* Comparación con el periodo anterior.

Mostrar una alerta visible:

“Las métricas pertenecen a un entorno de demostración y no representan ventas reales”.

PEDIDOS Y ENVÍOS

Estados:

* Pago pendiente.
* Pagado.
* En preparación.
* Enviado.
* Entregado.
* Cancelado.
* Devolución solicitada.
* Reembolsado.

El productor podrá:

* Confirmar preparación.
* Seleccionar paquetería.
* Capturar guía.
* Indicar fecha de envío.
* Consultar seguimiento.

El comprador podrá:

* Consultar línea de tiempo.
* Copiar número de guía.
* Solicitar ayuda.
* Confirmar recepción.
* Solicitar devolución.

La cotización del envío deberá realizarse antes del pago utilizando código postal, peso y dimensiones simuladas. No esperar hasta después de la compra para calcularlo.

GENERACIÓN DE QR

Cada producto publicado debe generar:

* Código QR visual.
* URL pública única.
* Botón descargar PNG.
* Botón imprimir ficha.
* Activar o desactivar.
* Contador de escaneos.
* Fecha del último escaneo.

Al escanear, abrir directamente la ficha pública del producto.

SOPORTE

Crear centro de ayuda con:

* Preguntas frecuentes.
* Tutoriales.
* Crear solicitud.
* Estado del ticket.
* Chat simulado.
* Botón de WhatsApp Business.
* Tiempo objetivo de respuesta menor a 24 horas.

PÁGINAS LEGALES

Crear:

* Aviso de privacidad.
* Términos y condiciones.
* Política de envíos.
* Política de devoluciones y cancelaciones.
* Derechos ARCO.
* Autorización de contenidos.
* Explicación de procedencia y trazabilidad.
* Solicitud de corrección o retiro cultural.

NOTIFICACIONES

Simular notificaciones para:

* Registro aprobado.
* Producto enviado a revisión.
* Producto publicado.
* Nueva venta.
* Pago aprobado o rechazado.
* Pedido en preparación.
* Pedido enviado.
* Pedido entregado.
* Bajo inventario.
* Nueva reseña.
* Solicitud de corrección.
* Consentimiento próximo a vencer.

COMPONENTES Y ESTADOS

Crear componentes reutilizables:

* Botones.
* Campos.
* Selectores.
* Carga de imágenes.
* Tarjetas de producto.
* Tarjetas de productor.
* Tablas.
* Modales.
* Alertas.
* Etiquetas de estado.
* Indicadores.
* Gráficas.
* Paginación.
* Breadcrumbs.
* Menú lateral.
* Encabezado móvil.
* Esqueletos de carga.
* Estados vacíos.
* Mensajes de error.
* Confirmaciones.

Agregar validaciones reales:

* Campos obligatorios.
* Correo válido.
* Precio mayor a cero.
* Stock entero.
* Consentimiento requerido.
* Código postal.
* Imágenes permitidas.
* Confirmación antes de eliminar.
* Prevención de pedidos sin existencia.

EXPERIENCIA DE DEMOSTRACIÓN REGIONAL

Crear una ruta /demo-regional con botones para ejecutar rápidamente:

1. Registrar productor.
2. Publicar una pieza.
3. Autorizar ficha cultural.
4. Generar QR.
5. Comprar como consumidor.
6. Ejecutar pago sandbox.
7. Preparar y enviar pedido.
8. Consultar estadísticas del productor.
9. Consultar estadísticas del consumidor.
10. Revisar métricas administrativas.

Agregar un botón “Restablecer datos de demostración”.

CRITERIOS DE ACEPTACIÓN

La aplicación se considerará terminada cuando:

* Los tres roles puedan iniciar sesión.
* Cada rol vea únicamente su información.
* El catálogo tenga filtros funcionales.
* El productor pueda publicar una pieza mediante el formulario asistido.
* La comisión del 10 % y el neto se calculen automáticamente.
* El QR abra la ficha correcta.
* El carrito y checkout funcionen.
* El pago sandbox pueda aprobarse o rechazarse.
* Se genere un pedido con seguimiento.
* El productor pueda registrar una guía.
* El consumidor pueda revisar pedidos y estadísticas.
* El productor pueda revisar ventas, neto, QR y conversión.
* El administrador pueda revisar usuarios, productos, pedidos, pagos y estadísticas generales.
* Los datos persistan al actualizar la página.
* Existan estados de carga, error, vacío y éxito.
* La interfaz sea usable en móvil y escritorio.
* Todos los datos financieros y resultados estén identificados como demostración.
* No se presenten encuestas, ventas o pruebas simuladas como evidencia real.
