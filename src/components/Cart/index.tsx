import * as Dialog from '@radix-ui/react-dialog'
import { CartButton } from "../CartButton";
import { CardFinalization, CartClose, CartContent, CartProduct, CartProductDetails, CartProductImage, FinalizationDetails } from './styles';
import { X } from 'phosphor-react';
import Image from 'next/future/image';
import axios from 'axios';

import { useCart } from '../../hooks/UseCart';
import { useState } from 'react';

export function Cart(){
  const {cartItems, removeCartItem, cartTotal} = useCart();
  const cartQuantity = cartItems.length;

  const formattedCartTotal = new Intl.NumberFormat('pt-BR',{
    style:'currency',
    currency:'BRL'
  }).format(cartTotal)
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

  async function handleCheckout(){
    try{
      setIsCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        products: cartItems,
      })
      const {checkoutUrl} = response.data;

      window.location.href = checkoutUrl;

    }catch(err){
      alert('Falha ao redirecionar ao checkout')
      setIsCreatingCheckoutSession(false)
    }
  }
  return(
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <CartButton />
      </Dialog.Trigger>
      <Dialog.Portal>
        <CartContent>
          <CartClose>
            <X size={24} weight="bold" />
          </CartClose>
          <h2>Sacola de Compras</h2>
          <section>
            {cartQuantity<= 0 && (
              <p>Parece que seu carrinho está vazio :(</p>
            )}
            {cartItems.map((cartItem) =>(
              <CartProduct key={cartItem.id} >
                <CartProductImage>
                  <Image
                    width={100} 
                    height={93} 
                    alt="" 
                    src={cartItem.urlImagem} 
                  />
                </CartProductImage>
                <CartProductDetails>
                  <p>{cartItem.nome}</p>
                  <strong>{cartItem.preco}</strong>
                  <button onClick={() => removeCartItem(cartItem.id)} >Remover</button>
                </CartProductDetails>
              </CartProduct>
            ))}
          </section>
          <CardFinalization>
            <FinalizationDetails>
              <div>
                <span>Quantidade</span>
                <p>{cartQuantity} {cartQuantity >= 1 ? 'item' : 'items'}</p>
              </div>
              <div>
                <span>Valor Total</span>
                <p>{formattedCartTotal}</p>
              </div>
            </FinalizationDetails>
            <button onClick={handleCheckout} disabled={isCreatingCheckoutSession || cartQuantity <= 0 }>Finalizar compra</button>
          </CardFinalization>
        </CartContent>
      </Dialog.Portal>
    </Dialog.Root>
    
  )
}