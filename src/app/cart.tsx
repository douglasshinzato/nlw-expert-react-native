import { useState } from "react"
import { View, Text, ScrollView, Alert, Linking } from "react-native"
import { useNavigation } from "expo-router"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Feather } from "@expo/vector-icons"

import { ProductCartProps, useCartStore } from "@/stores/cart-store"

import { currencyFormat } from "@/utils/functions/currency-format"

import { Header } from "@/components/header"
import { Product } from "@/components/product"
import { LinkButton } from "@/components/link-button"
import { Input } from "@/components/input"
import { Button } from "@/components/button"

const PHONE_NUMBER = "5567999034695"

export default function Cart() {
  const [address, setAddress] = useState("")
  const cartStore = useCartStore()
  const navigation = useNavigation()

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id),
      },
    ])
  }

  const total = currencyFormat(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  )

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe os dados da entrega.")
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("")

    const message = `
      NOVO PEDIDO
      \n Entregar em: ${address}
      ${products}
    \n Valor total: ${total}
    `

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    )

    cartStore.clear()
    navigation.goBack()
  }

  return (
    <View className="flex-1 pt-8 pb-8">
      <Header title="Seu carrinho"></Header>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={350}
      >
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    onPress={() => {
                      handleProductRemove(product)
                    }}
                  />
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio.
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total:</Text>
              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>
            <Input
              placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
              onChangeText={setAddress}
              blurOnSubmit={true}
              onSubmitEditing={handleOrder}
              returnKeyType="send"
            />
          </View>
          <View className="p-5 gap-5">
            <Button onPress={handleOrder}>
              <Button.Text>Enviar pedido</Button.Text>
              <Button.Icon>
                <Feather name="arrow-right-circle" size={20} />
              </Button.Icon>
            </Button>
            <LinkButton title="Voltar ao cardápio" href="/" />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  )
}
