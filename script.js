const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addresWarn = document.getElementById("address-warn");

let cart = [];

// Quando apertar no botão irá acessar o modal e modificar o estilo para flex para poder aparecer, já que no começo está como hidden
//Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora 
//podemos usar o target para saber onde estamos clicando
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//console.log(event.target) mostra em qual elemento criou
menu.addEventListener("click", function(event) {

    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price")) 
        addToCart(name,price)
    }
})

//Função para adicionar no carrinho 
function addToCart(name,price) {
    const existingItem = cart.find(item => item.name === name) 

    if(existingItem) {
        //se o item já existe aumenta apenas a qunatidade + 1
        existingItem.quantity += 1;
    } else {
        cart.push ( {
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//Atualiza carrinho 
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    //vai percorrer a lista
    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement)
    })

    // Coloca o valor no real brasileiro 
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    //Modifica o valor no carrinho de quantos items tem
    cartCounter.innerHTML = cart.length;
   
}

//Função para remover o item do carrinho 
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemsCart(name);
    }
})

function removeItemsCart(name) {
    //verifica a posição que ele está
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const items = cart[index];

        // se for maior que um diminue a quantidade que tiver
        if(items.quantity > 1) {
            items.quantity -=1;
            updateCartModal();
            return;
        }

        //remove o item da lista 
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== '') {
        addressInput.classList.remove("border-red-500")
        addresWarn.classList.add("hidden")
    }

})

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen) {
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
            return;
    }

    if(cart.length === 0) return;
    //quando não tiver o item no carrinho ele vai mostrar uma mensagem 
    if(addressInput.value === "") {
        addresWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api whats
    // const cartItems = cart.map((item) => {
    //     return `${item.name} 
    //     Quantidade: (${item.quantity}) 
    //     Preço: R$${item.price}\n`; 
    // }).join("");
    
    // const message = encodeURIComponent(cartItems)
    // const phone = "coloque o número da sua empresa"

    // window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
    // cart = [];
    // addressInput.value = '';
    // updateCartModal();

})

// Verficar a hora e manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; 
    //true = restaurante aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

    // se estiver aberto vai remover o vermelho e adicionar verde
    if(isOpen) {
        spanItem.classList.remove("bg-red-500");
        spanItem.classList.add("bg-green-600");
    // se estiver fechado, remove o verde e adiciona o vermelho
    } else {
        spanItem.classList.remove("bg-green-600")
        spanItem.classList.add("bg-red-500")
    }



