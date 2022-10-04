import { HeaderContainer } from "./styles"
import Image from 'next/future/image'
import Link from "next/link"

import logoImg from '../../assets/logo.svg'

export function Header() {
  return (
    <HeaderContainer>
      <Link href="/">
        <a><Image src={logoImg} alt="" /></a>
      </Link>
    </HeaderContainer>
  )
}