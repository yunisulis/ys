document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
       items: [
        {id: 1, name: 'PAKET 1(Komplit)', img: 'maulid7.jpg', price: 2500000},
        {id: 2, name: 'PAKET 2 (Sound 5k wat)', img: 'image.jpg', price: 3000000},
        {id: 3, name: 'PAKET 3 (Hajatan)', img: 'hajatan.jpg', price: 2000000},
        {id: 4, name: 'cat', img: 'CATjpg.jpg', price: 50000},
        {id: 5, name: 'lampu', img: 'lampu.jpg', price: 60000},
        {id: 6, name: 'semen', img: 'semen.jpg', price: 70000},
        {id: 7, name: 'bata', img: 'ba.jpg', price: 80000},
    ],
        



}));

Alpine.store('cart', {
    items: [],
    total: 0,
    quantity:0,
    add(newItem){

        

        // cek apakah ada barang yang sama di cart
    const cartItem = this.items.find((item) => item.id === newItem.id);

    //jika belum ada / cart masih kosong
    if (!cartItem){
        this.items.push({...newItem, quantity: 1, total: newItem.price});
        this.quantity++;
        this.total += newItem.price;

    } else{
        this.items = this.items.map((item) =>{
            // jika barang tersedia
         if(item.id  !== newItem.id){
                return item;
        } else{
                //jika barang sudah ada, tambah quantity dan totalnya
                item.quantity++;
                item.total = item.price * item.quantity;
                this.quantity++;
                this.total += item.price;
                return item;
            }
        });
    }
       

        
       

    },
    remove(id){
        const cartItem = this.items.find((item) => item.id === id);

        if (cartItem.quantity > 1){
            this.items = this.items.map((item) =>{
                if(item.id !== id){
                    return item;
                } else {
                    item.quantity--;
                    item.total = item.price * item.quantity;
                    this.quantity--;
                    this.total -= item.price;
                    return item;
                }
            });

        } else if(cartItem.quantity === 1){
            this.items = this.items.filter((item) => item.id !== id);
            this.quantity--;
            this.total -= cartItem.price;
        }
    },
});
});
// form validasi

const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function (){
    for (let i = 0; i < form.elements.length; i++){
        if (form.elements[i].value.length !== 0){
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else{
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

//kirim data 

checkoutButton.addEventListener('click',  async function (e){
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
   const message = formatMessage(objData);
   window.open('https://wa.me/6288215496851?text=' + encodeURIComponent(message));

  //minta transition token

try{
    const response =  await fetch('php/place.php', {
        method: 'POST',
        body: data,
    });
    const token = await response.text();
    //console.log(token);
     window.snap.pay(token);
} catch (err){
    console.log(err.message);
}
});


//format pesan
const formatMessage = (obj) =>{
    return `Data Customer
    Nama: ${obj.name}
    No HP: ${obj.phone}
    Acara: ${obj.acara}
    Alamat: ${obj.alamat}
    Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`)}
    TOTAL: ${rupiah(obj.total)}
    (website ini hanya untuk wilayah KOTA BREBES)
    Terima Kasih.`;
};


const rupiah = (number) =>{
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,

    }).format(number);
}