let modalQt = 1;
let cart = [];
let modalKey = 0;

//reduzir o querySelector
const qs = (elem) => document.querySelector(elem);
//reduzir o querySelectorAll
const qsa = (elem) => document.querySelectorAll(elem);

//listagens das pizzas
pizzaJson.map((item, index) => {
    //clonar o modelo base para as pizzas
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; //inner substitui as infos
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--img img').src=item.img;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{ //quando clicar na imagem de uma das pizzas
        e.preventDefault(); //previne que atualize a pagina
        modalQt = 1;
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key; //guarda qual pizza eh
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected'); //item do size que esta selecionado
        qsa('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex==2){
                size.classList.add('selected'); //torna o tamanho grande como padrao        
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        qs('.pizzaInfo--qt').innerHTML = modalQt; //define sempre como 1
        
        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = 1;        
        },200);
    });

    //preencher as infos em pizza-item
    qs('.pizza-area').append(pizzaItem);
});

//Eventos do MODAL (que é um só)
function closeModal(){
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        qs('.pizzaWindowArea').style.display = 'none';        
    },500);
}

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal); //aqui a funcao nao tem ()
});
qs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt>1){
        modalQt--;
    };
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});
qs('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;        
});
qsa('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
qs('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //Qual a pizza?
    //modalKey;
    
    //Qual o tamanho?
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    //Quantas?
    //modalQt;
    
    //criar identificador para juntar as pizzas iguais add em tempos diferentes
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });

    if(key>-1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size: size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});

qs('.menu-closer').addEventListener('click', () =>{
    qs('aside').style.left = '100vw';
});

qs('.menu-openner').addEventListener('click', () =>{
    if(cart.length>0){
        qs('aside').style.left = '0';        
    }
});

function updateCart(){
    //atualiza a quantidade do botao MOBILE
    qs('.menu-openner span').innerHTML = cart.length;

    if(cart.length>0){
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = ''; //zera e dps mostra

        //valores no carrinho
        let total = 0;
        let subtotal = 0;
        let desconto = 0;
        
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => { //retorna o item que esta no carrinho pelo Json
                return item.id == cart[i].id;
            });
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = qs('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            switch (cart[i].size){
                case 0:
                    pizzaSizeName = 'Pequena'; 
                    break;
                case 1:
                    pizzaSizeName = 'Média'; 
                    break;
                case 2:
                    pizzaSizeName = 'Grande'; 
                    break;              
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item--nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt>1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1); //remove a propria posicao do carrinho
                }
                
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            qs('.cart').append(cartItem); 

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else{
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';   
    }
}