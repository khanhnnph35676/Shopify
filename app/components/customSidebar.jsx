import React from "react";
import {Link, useNavigate} from "@remix-run/react";
import {Icon} from "@shopify/polaris";
import './css/style.css'
import {
  HomeIcon,
  ProductIcon,
} from "@shopify/polaris-icons";

export default function CustomSidebar() {
  const navigate = useNavigate();
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-top">
          <Link to='/app'><Icon source={HomeIcon}/></Link>
        </div>
        <div className="sidebar-content">
          <ul className='list'>
            <li className='list-item'>
              <Link to='/app/product' className='list-item-inside'>
                <Icon className='icon' source={ProductIcon}/>
                <span className='span-item-inside'>Products</span>
              </Link>
            </li>
            <li className='list-item'>
              <div className='list-item-inside'>
                <Icon source={ProductIcon}/>
              </div>
            </li>
            <li className='list-item'>
              <div className='list-item-inside'>
                <Icon source={ProductIcon}/>
              </div>
            </li>
            <li className='list-item'>
              <div className='list-item-inside'>
                <Icon source={ProductIcon}/>
              </div>
            </li>
            <li className='list-item'>
              <div className='list-item-inside'>
                <Icon source={ProductIcon}/>
              </div>
            </li>
            <li className='list-item'>
              <div className='list-item-inside'>
                <Icon source={ProductIcon}/>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
