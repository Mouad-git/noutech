document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-form");
    const registerForm = document.querySelector(".register-form");
    const switchToLogin = document.querySelector(".switch-to-login");
    const registerButton = document.querySelector(".btn-secondary");

    const USERS_KEY = "users"; // Clé pour stocker les utilisateurs dans LocalStorage

    // Fonction pour récupérer les utilisateurs
    function getUsers() {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    // Fonction pour sauvegarder un nouvel utilisateur
    function saveUser(newUser) {
        const users = getUsers();
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Gestion de l'inscription
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = registerForm.username.value.trim();
        const email = registerForm.email_address.value.trim();
        const password = registerForm.password.value.trim();
        const confirmPassword = registerForm.confirm_password.value.trim();

        // Validation des champs
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const users = getUsers();
        const userExists = users.some(user => user.email_address === email);

        if (userExists) {
            alert("User with this email already exists!");
            return;
        }

        const newUser = { username, email_address: email, password };
        saveUser(newUser);

        alert("Registration successful! You can now log in.");
        registerForm.reset();
    });

    // Gestion de la connexion
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = loginForm.email_address.value.trim();
        const password = loginForm.password.value.trim();

        const users = getUsers();
        const user = users.find(user => user.email_address === email && user.password === password);

        if (user) {
            alert(`Welcome back, ${user.username}!`);
        } else {
            alert("Invalid email or password.");
        }

        loginForm.reset();
    });

    // Gestion du basculement entre les formulaires
    switchToLogin.addEventListener("click", () => {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
    });

    registerButton.addEventListener("click", () => {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    });
});





