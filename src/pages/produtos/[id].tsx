import Image from "next/future/image"
import axios from "axios"
import { DetalhesProduto, ImagemContainer, ProdutoContainer } from "../../styles/pages/produto"
import { GetStaticPaths, GetStaticProps } from "next"
import { stripe } from "../../lib/stripe"
import Stripe from 'stripe'
import { useState } from "react"

interface ProdutoProps{
  produto:{
    id: string,
    nome: string,
    urlImagem:string,
    preco:string,
    descricao: string,
    precoId: string
  }
}

export default function Produtos({produto }:ProdutoProps ){
  const [criarSessaoCheckout,setCriarSessaoCheckout] = useState(false)
  async function acaoComprarProduto(){
    try{
      setCriarSessaoCheckout(true)
      const response = await axios.post('/api/checkout',{
        precoId : produto.precoId
      })
      const {checkoutUrl} = response.data

      window.location.href = checkoutUrl

    }catch(err){
      //Conectar com ferramenta de observalidade
      setCriarSessaoCheckout(false)
      alert('Falha ao redirecionar ao checkout')
    }
  }
  return (
    <ProdutoContainer>
      <ImagemContainer>
        <Image src={produto.urlImagem} width={520} height={480} alt=""/>
      </ImagemContainer>
      <DetalhesProduto>
          <h1>{produto.nome}</h1>
          <span>{produto.preco}</span>
          <p>{produto.descricao}</p>

          <button
            onClick={acaoComprarProduto} 
            disabled={criarSessaoCheckout}>
            Comprar agora
          </button>
        </DetalhesProduto>
    </ProdutoContainer>
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
      }
    },
    revalidate: 60 * 60 * 1 , //1 hora
  }
}