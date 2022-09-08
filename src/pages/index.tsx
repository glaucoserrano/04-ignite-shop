import Image from "next/future/image"
import { HomeContainer, Product } from "../styles/pages/home"
import { stripe } from "../lib/stripe"
import { GetStaticProps } from "next"
import {useKeenSlider} from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Stripe from 'stripe'
import Link from "next/link"
import Head from "next/head"


interface HomeProps{
  produtos:{
    id:string,
    nome: string,
    urlImagem: string,
    preco: string
  }[]
}

export default function Home({produtos }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides:{
      perView: 3,
      spacing:48
    }
  })

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {produtos.map(produto => {
          return (
            <Link key={produto.id} href={`/produtos/${produto.id}`} prefetch={false}>
              <Product className="keen-slider__slide">
                <Image src={produto.urlImagem} width={520} height={480} alt="" />
                <footer>
                  <strong>{produto.nome}</strong>
                  <span>{produto.preco}</span>
                </footer>
              </Product>
            </Link>
          )
        })}
        
      </HomeContainer>
    </>
  )
}
export const getStaticProps: GetStaticProps  = async() =>{
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })
  
  const produtos = response.data.map(produto =>{
    const preco = produto.default_price as Stripe.Price
    return{
      id: produto.id,
      nome: produto.name,
      urlImagem: produto.images[0],
      preco: new Intl.NumberFormat('pt-BR',{
        style: 'currency',
        currency: 'BRL'
      }).format(preco.unit_amount / 100),
    }
  })
  return {
    props:{
      produtos,
    },
    revalidate: 60 * 60 * 2, //2 horas
  }
}