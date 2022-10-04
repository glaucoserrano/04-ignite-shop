import Image from "next/future/image"
import { HomeContainer, Product, SliderContainer } from "../styles/pages/home"
import useEmblaCarousel from 'embla-carousel-react'
import { stripe } from "../lib/stripe"
import { GetStaticProps } from "next"


import Stripe from 'stripe'

import Head from "next/head"

import { useCart } from "../hooks/UseCart"
import { IProduct } from "../contexts/CartContext"
import { MouseEvent, useEffect, useState } from "react"
import { ProductSkeleton } from "../components/ProductSkeleton"
import Link from "next/link"
import { CartButton } from "../components/CartButton"


interface HomeProps{
  produtos:IProduct[];
}

export default function Home({produtos }: HomeProps) {
  const [isLoading,setIsLoading] = useState(true)
  const [emblaRef] = useEmblaCarousel({
    align:'start',
    skipSnaps: false,
    dragFree : true,
  })

  useEffect(() => {
    const timeOut = setTimeout(() => setIsLoading(false),2000)
    
    return () => clearTimeout(timeOut)
  },[])
  const {addToCart, checkIfItemAlreadyExists} = useCart();

  function handleAddToCart(e: MouseEvent<HTMLButtonElement>, produto: IProduct){
    e.preventDefault();
    addToCart(produto);
  }

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <div style={{overflow:'hidden', width:'100%'}}>
        <HomeContainer>
          <div className="embla" ref={emblaRef}>
            <SliderContainer className="embla__container container">
              {isLoading ?(
                <>
                  <ProductSkeleton className="embla__slide" />
                  <ProductSkeleton className="embla__slide" />
                  <ProductSkeleton className="embla__slide" />
                </>
              ): (
                <>
                  {produtos.map(produto => {
                  return (
                    <Link key={produto.id} href={`/produtos/${produto.id}`} prefetch={false}>
                      <Product className="embla__slide">
                        <Image src={produto.urlImagem} width={520} height={480} alt="" />
                        <footer>
                          <div>
                            <strong>{produto.nome}</strong>
                            <span>{produto.preco}</span>
                          </div>
                          <CartButton 
                            color='green' 
                            size='large'
                            disabled={checkIfItemAlreadyExists(produto.id)}
                            onClick={(e) => handleAddToCart(e,produto)}
                          />
                        </footer>
                      </Product>
                    </Link>
                    )
                  })}
                </>
              )}
            </SliderContainer>
          </div>
        </HomeContainer>
      </div>
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
      numberPrice: preco.unit_amount/100,
      defaultPriceId: preco.id
    }
  })
  return {
    props:{
      produtos,
    },
    revalidate: 60 * 60 * 2, //2 horas
  }
}