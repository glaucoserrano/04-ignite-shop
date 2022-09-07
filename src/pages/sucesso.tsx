import { GetServerSideProps } from "next";
import Link from "next/link";
import { stripe } from "../lib/stripe";
import { ImagemContainer, SucessoContainer } from "../styles/pages/sucesso";
import Stripe from 'stripe'
import Image from "next/future/image";


interface SucessoProps{
  nomeCliente: string,
  produto:{
    nome: string,
    urlImagem: string
  }
}
export default function Sucesso({nomeCliente, produto}: SucessoProps  ){
  
  return(
    <SucessoContainer>
      <h1>Compra Efetuada</h1>
      <ImagemContainer>
        <Image src={produto.urlImagem} width={120} height={110}  alt=''/>
      </ImagemContainer>
      <p>
        Uhuul <strong>{nomeCliente}</strong>, sua <strong>{produto.nome}</strong> já está a caminho da sua casa. 
      </p>
      <Link href="/"><a>Voltar ao catálogo</a></Link>
    </SucessoContainer>
  )
}
export const getServerSideProps: GetServerSideProps = async ({query}) =>{
  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId,{
    expand:['line_items','line_items.data.price.product']
  })

  const nomeCliente = session.customer_details.name
  const produto = session.line_items.data[0].price.product as Stripe.Product

  return{
    props:{
      nomeCliente,
      produto:{
        nome: produto.name,
        urlImagem: produto.images[0]
      }
    }
  }
}