import { GetServerSideProps } from "next";
import Link from "next/link";
import { stripe } from "../lib/stripe";
import { ImagemContainer, ImagensContainer, SucessoContainer } from "../styles/pages/sucesso";
import Stripe from 'stripe'
import Image from "next/future/image";
import Head from "next/head";


interface SucessoProps{
  nomeCliente: string,
  produtos:string[]
}
export default function Sucesso({nomeCliente, produtos}: SucessoProps  ){
  
  return(
    <>
      <Head>
        <title>Compra Efetuada | Ignite Shop</title>
        <meta name="robots" content="noindex" />
      </Head>
      <SucessoContainer>
        
        <ImagensContainer>
        
          {produtos.map((image,i) => (
            <ImagemContainer key={i}>
              <Image src={image} width={120} height={110}  alt=''/>
            </ImagemContainer>
          ) )}
        
        </ImagensContainer>
        <h1>Compra Efetuada</h1>
        <p>
        
          Uhuul <strong>{nomeCliente}</strong>, sua compra de {" "}
          {produtos.length} camisetas já está a caminho da sua casa. 
        </p>
        <Link href="/"><a>Voltar ao catálogo</a></Link>
      </SucessoContainer>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async ({query}) =>{

  
  if(!query.session_id){
    return {
      redirect:{
        destination: '/',
        permanent: false
      }
    }
  }
  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId,{
    expand:['line_items','line_items.data.price.product']
  })

  const nomeCliente = session.customer_details.name
  const produtos = session.line_items.data.map(item => {
    const produto = item.price.product as Stripe.Product
    return produto.images[0]
  })

  return{
    props:{
      nomeCliente,
      produtos,
    }
  }
}