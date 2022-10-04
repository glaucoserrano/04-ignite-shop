import { NextApiRequest, NextApiResponse } from "next";
import { IProduct } from "../../contexts/CartContext";
import { stripe } from "../../lib/stripe";


export default async function handle(req: NextApiRequest,res: NextApiResponse){
  const { products } = req.body as {products : IProduct[]};
  
  if(req.method!=='POST'){
    return res.status(405).json({error:'Metodo incorreto'})
  }
  
  if(!products){
    return res.status(400).json({error:'Produto não encontrado'})
  }

  const sucess_url = `${process.env.NEXT_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`
  const cancel_url = `${process.env.NEXT_URL}/`

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url:sucess_url,
    cancel_url:cancel_url,
    mode:'payment',
    line_items: products.map(product => ({
      price: product.defaultPriceId,
      quantity: 1,
    }))
 })
 return res.status(201).json({
  checkoutUrl: checkoutSession.url,
 })
}