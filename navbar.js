document.addEventListener("DOMContentLoaded", function() {
    const navbarHTML = `
        <nav class="navbar">
            <div class="nav-left">
                <div class="logo">PagWeb</div>
                <ul class="nav-links">
                    <li><a href="home.html">Inicio</a></li>
                    <li><a href="pag1.html">Página 1</a></li>
                    <li><a href="pag2.html">Página 2</a></li>
                </ul>
            </div>
            <div class="nav-right">
                <a href="login.html" class="logout-btn">Cerrar Sesión</a>
            </div>
        </nav>

        <style>
            body {
                margin: 0;
                padding: 0;
            }

            .navbar {
                padding: 15px 30px;
                background-color: #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: 'Arial';
            }

            .nav-left {
                display: flex;
                align-items: center;
                gap: 30px;
            }

            .logo {
                color: white;
                font-size: 20px;
                font-weight: bold;
            }

            .nav-links {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                gap: 35px; 
            }

            .nav-links a {
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
            }
            .logout-btn {
                background-color: #c9302c;
                color: white;
                padding: 8px 15px;
                border-radius: 4px;
                text-decoration: none;
                font-weight: bold;
            }
        </style>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
});
