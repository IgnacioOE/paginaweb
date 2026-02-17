document.addEventListener("DOMContentLoaded", function() {
    const footerHTML = `

        <div class="spacer"></div>
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Sobre Nosotros</h3>
                    <p>Somos una empresa que se dedica a hacer páginas web innovadoras.</p>
                </div>
                <div class="footer-section">
                    <h3>Contacto</h3>
                    <p>Email: contacto@gmail.com</p>
                    <p>Teléfono: +52 123 456 7890</p>
                </div>
            </div>
        </footer>

        <style>
            body {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }
            .spacer {
                flex-grow: 1;
            }
            .footer {
                background-color: #333;
                color: white;
                padding: 10px 0;
                margin-top: 30px;
                font-family: Arial;
                font-size: 0.9em;
            }

            .footer-content {
                display: flex;
                max-width: 1000px;
                margin: auto;
                padding: 10px 20px;
            }

            .footer-section {
                flex: 1;
                margin-left: 50px;
                margin-right: 50px;
            }

            .footer-section h3 {
                border-bottom: 2px solid #555;
                padding-bottom: 5px;
                margin-bottom: 8px;
            }

        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
});
