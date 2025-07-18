const admins = {
    'EERE': 'RERET',
    'TRTRTRT': 'UYUYU',
    'YUYUYU': 'YUYUY'
};

const users = {
    'Drick': '1230',
    'Walter': '1231',
    'matrix@adilson': '8877',
    'matrix@africano': '8877'

};

function redirectToMatrix(casa) {
    document.getElementById('chooseHousePage').classList.add('hidden');
    document.getElementById('botmatrix').classList.remove('hidden');
    document.getElementById('mensagem').innerText = `Você escolheu: ${casa}`;
    // Aqui você pode adicionar a lógica para redirecionar ou processar a escolha específica da casa de aposta
}


function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (admins[username] && admins[username] === password) {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('adminPage').classList.remove('hidden');
    } else if (users[username] && users[username] === password) {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('chooseHousePage').classList.remove('hidden');
    } else {
        const errorMsg = document.getElementById('errorMessage');
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'Credenciais inválidas. Tente novamente.';
    }
}


function redirectToMatrix(casa) {  
    // Esconde a tela de escolha da casa  
    document.getElementById('chooseHousePage').classList.add('hidden');  

    // Mostra a tela de Bot Matrix  
    document.getElementById('botmatrix').classList.remove('hidden');  

    // Carregar o script específico para a casa escolhida  
    loadScriptForHouse(casa);  
}  

function loadScriptForHouse(casa) {  
    // Remove scripts existentes, se necessário  
    const existingScript = document.getElementById('dynamic-script');  
    if (existingScript) {  
        existingScript.remove();  
    }  

    // Cria um novo elemento de script  
    const script = document.createElement('script');  
    script.id = 'dynamic-script';  

    // Define o caminho do script com base na casa  
    switch (casa) {  
        case 'casa1':  
            script.src = 'pre.js' 
            break;  
        case 'casa2':  
            script.src = '88pre.js' 
            break;  
        case 'casa3':  
            script.src = '88pre.js' 
            break;  
        case 'casa4':  
            script.src = 'all.js';  
            break;  
        default:  
            console.error('');  
            return;  
    }  

    // Adiciona o script à página  
    document.body.appendChild(script);  
}



function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const showPasswordCheckbox = document.getElementById("showPassword");
    passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
}





