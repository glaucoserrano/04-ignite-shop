import Image from "next/future/image"
import { DetalhesProduto, ImagemContainer, ProdutoContainer } from "../../styles/pages/produto"
import { GetStaticPaths, GetStaticProps } from "next"
import { stripe } from "../../lib/stripe"
import Stripe from 'stripe'

import Head from "next/head"
import { useCart } from "../../hooks/UseCart"
import { useRouter } from "next/router"
import { IProduct } from "../../contexts/CartContext"

interface ProdutoProps{
  produto:IProduct;
}

export default function Produtos({produto }:ProdutoProps ){
  const {isFallback} = useRouter();

  const {checkIfItemAlreadyExists, addToCart} = useCart();

  if(isFallback){
    return <p>Loading ....</p> 
  }

  const itemAlreadyInCart = checkIfItemAlreadyExists(produto.id)

  return (
    <>
      <Head>
        <title>{produto.nome} | Ignite Shop</title>
      </Head>
      <ProdutoContainer>
        <ImagemContainer>
          <Image src={produto.urlImagem} width={520} height={480} alt=""/>
        </ImagemContainer>
        <DetalhesProduto>
            <h1>{produto.nome}</h1>
            <span>{produto.preco}</span>
            <p>{produto.descricao}</p>

            <button
              onClick={() => addToCart(produto)} 
              disabled={itemAlreadyInCart}>
              {itemAlreadyInCart ?'Produto já está no carrinho' :  'Colocar na sacola'}
            </button>
          </DetalhesProduto>
      </ProdutoContainer>
    </>
  )

}
export const getStaticPaths : GetStaticPaths = async () =>{
  return {
    paths:[],
    fallback: 'blocking',
  }
}

export const getStaticProps : GetStaticProps<any,{ id: string}> = async ({ params }) =>{
  
  const idProduto = params.id
  const produto = await stripe.products.retrieve(idProduto,{
    expand: ['default_price']
  })

  
  const preco = produto.default_price as Stripe.Price

  return{
    props:{
      produto: {
        id: produto.id,
        nome: produto.name,
        urlImagem: produto.images[0],
        preco: new Intl.NumberFormat('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }).format(preco.unit_amount / 100),
        descricao: produto.description,
        precoId: preco.id,
        numberprice: preco.unit_amount / 100
      }
    },
    revalidate: 60 * 60 * 1 , //1 hora
  }
}