import { Stack } from 'expo-router';
import { ViajeProvider } from '../context/ViajeContext';
import { PagosProvider } from '../context/PagosContext';
import { SesionProvider } from '../context/SesionContext';
import { CatalogosProvider } from '../context/CatalogosContext';

export default function RootLayout() {
  return (
    <SesionProvider><CatalogosProvider><PagosProvider><ViajeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ViajeProvider></PagosProvider></CatalogosProvider></SesionProvider>
  );
}
