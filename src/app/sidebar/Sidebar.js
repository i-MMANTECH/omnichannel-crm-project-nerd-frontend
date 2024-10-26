import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faWallet,
    faExchangeAlt,
    faCoins,
    faChartLine,
    faCode,
    faCog,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="h-full bg-white shadow-lg z-10 pt-5">
            <div className="mt-4">
                <ul className="flex flex-col">
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/dashboard') ? 'bg-blue-100 text-blue-600' : ''}`}
                            to="/dashboard"
                        >
                            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" /> Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/wallet') ? 'bg-blue-100 text-blue-600' : ''}`}
                            to="/wallet"
                        >
                            <FontAwesomeIcon icon={faWallet} className="mr-2" /> Wallet
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/switch') ? 'bg-blue-100 text-blue-600' : ''}`}
                            to="/switch"
                        >
                            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" /> Switch
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/tokens') ? 'bg-blue-100 text-blue-600' : ''}`}
                            to="/tokens"
                        >
                            <FontAwesomeIcon icon={faCoins} className="mr-2" /> Tokens
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/insight') ? 'bg-blue-100 text-blue-600' : ''}`}
                            to="/insight"
                        >
                            <FontAwesomeIcon icon={faChartLine} className="mr-2" /> Insight
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/developers') ? 'bg-blue-100 text-blue-600' : ''}`}
                            to="/developers"
                        >
                            <FontAwesomeIcon icon={faCode} className="mr-2" /> Developers
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${isActive('/settings') ? 'bg-blue-100 text-blue-600' : ''}`}
                            to="/settings"
                        >
                            <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
