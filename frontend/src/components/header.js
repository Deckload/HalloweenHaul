
import logo from './logo.png'; // Tell webpack this JS file uses this image

export default function Header() {
    return <img src={logo} alt="Logo" />;
}