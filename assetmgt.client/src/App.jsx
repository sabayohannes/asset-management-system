import { RouterProvider } from 'react-router-dom';
import './App.css';

// Berry imports
import ThemeCustomization from './themes';
import NavigationScroll from './layout/NavigationScroll';
import { ConfigProvider } from './contexts/ConfigContext';
import router from './routes'; // Berry router

// ==============================|| APP ||============================== //

export default function App() {
    return (
        <ConfigProvider>
            <ThemeCustomization>
                <NavigationScroll>
                    <RouterProvider router={router} />
                </NavigationScroll>
            </ThemeCustomization>
        </ConfigProvider>
    );
}
