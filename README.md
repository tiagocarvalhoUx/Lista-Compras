# 🛒 Lista de Compras

App mobile de lista de compras focado em **pessoas idosas** — simples, acessível e intuitivo.

## Tecnologias

- **React Native** (Expo SDK 54)
- **TypeScript**
- **NativeWind** (TailwindCSS para React Native)
- **Zustand** (estado global)
- **AsyncStorage** (persistência offline)
- **React Navigation** (Bottom Tabs)
- **React Native Reanimated** (animações)
- **Expo Haptics** (feedback tátil)

## Funcionalidades

- ✅ Múltiplas listas com alternância e renomeação
- ✅ Adicionar itens (modo simples e avançado)
- ✅ Categorias com cor e ícone (9 categorias)
- ✅ Barra de progresso e percentual de conclusão
- ✅ Busca em tempo real e filtros por categoria
- ✅ Ordenação por categoria, nome ou data
- ✅ Agrupamento por categoria
- ✅ Animações suaves ao marcar itens
- ✅ Feedback tátil (haptics)
- ✅ Adição rápida de itens comuns
- ✅ Recorrência semanal/mensal
- ✅ Histórico de itens concluídos
- ✅ Compartilhamento via WhatsApp, email etc.
- ✅ Tema claro/escuro
- ✅ Tamanho de fonte ajustável (P/M/G)
- ✅ 100% offline (AsyncStorage)

## Estrutura

```
src/
├── components/       # HeaderProgress, ItemCard, AddItemCard, FilterBar,
│                     # QuickAdd, SettingsModal, ListPickerModal
├── screens/          # MyListScreen, HistoryScreen, ShareScreen
├── navigation/       # AppNavigator (Bottom Tabs)
├── store/            # useStore (Zustand + AsyncStorage)
├── hooks/            # useTheme
├── types/            # Interfaces TypeScript
├── constants/        # categories, theme
└── utils/            # sortItems, groupByCategory, shareText
```

## Como rodar

```bash
cd ListaDeCompras
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android/iOS) ou rode no emulador.

## Acessibilidade

- Fontes grandes por padrão
- Botões com área de toque ampla
- Alto contraste entre elementos
- Feedback visual e tátil em cada ação
- Navegação simples com 3 abas
