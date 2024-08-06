import React from 'react'
import BaseComponent from './BaseComponent'
import Iframe from 'react-iframe'

export default class extends BaseComponent {
    
    componentDidMount() {
        setTimeout(() => {
            let iframe = document.getElementById( 'auto3d-widget-vendor' );
            console.log(iframe);
        }, 500);
        
    }

       
    render() {
      
        let url = "https://app.3dcompare.com/market/industrial-forms?widgetVendorId=KiWanovWf566dySy3";

      
        return (            
            <Iframe 
                width="100%"              
                url={url}
                id="auto3d-widget-vendor"
                frameBorder="0"
                scrolling="yes"
                className="auto3dWidget"
            />
        )

        
	
    }
}
