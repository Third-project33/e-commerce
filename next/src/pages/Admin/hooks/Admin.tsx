import React, {useEffect,useState} from 'react';
import axios from 'axios'
import '../styles/admin.css';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Admin = () => {

    //=> Initialize Next.js router for navigation
    const router=  useRouter()
//=> State for storing brand data with TypeScript interface
    const [data, setData] =  useState<{
        id: number;        // Unique identifier for each brand
        name: string;      // Brand name
        logo: string;      // URL for brand logo
        volume: number;    // Trading volume
        day: string;       // 24h percentage change
        owner: number;     // Number of owners
        verified: number;  // Verification status (0 or 1)
    }[]>([])
 //==>  State for storing number of items per brand
    const [items, setItems] = useState<{ [key: number]: number }>({});

    //=>  State for storing floor price per brand
    const [floorPrice, setfloorPrice] = useState<{ [key: number]: number }>({});  

//=>    to fetch and set items count for each brand
    const handleItems = async (brandId: number) : Promise<void> => {
        try {
            const productResponse = await axios.get(`http://localhost:3001/api/products/${brandId}`);
            setItems(prevCounts => ({
                ...prevCounts,
                [brandId]: productResponse.data.length 
            }));
            await handlePrice(brandId);
        } catch (error) {
            console.error(`Error fetching price for brand ID ${brandId}:`, error);
        }
    };
//=> to fetch and set floor price for each brand
    const handlePrice = async (brandId: number) : Promise<void> => {
        try {
            const priceResponse = await axios.get(`http://localhost:3001/api/products/${brandId}`);
            const lowestPrice = Math.min(...priceResponse.data.map((item: { price: number })=> item.price)); 
            setfloorPrice(prev => ({
                ...prev,
                [brandId]: lowestPrice

            })) ;
        } catch (error) {
            console.error(`Error fetching prices for brand ${brandId}:`, error);
        }
    };
//=> hook to fetch initial data and handle updates
    useEffect(() => {
        const fetchData = async () : Promise<void> => {
            try {
                const res = await axios.get("http://localhost:3001/brands/allbrands");
                setData(res.data);
                res.data.forEach((brand: { id: number })=> {
                    handleItems(brand.id);
                });
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };
        fetchData()

      //=> Refetch data if updated query parameter is present
        if (router.query.updated) {
            fetchData()
        }
    }, [router.query]); 


    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow p-8">
                 {/* Page Header */}
                <h1 className="text-4xl font-bold text-center mb-4">Top Market Statistics</h1>
                <p className="text-center mb-8">The top NFTs on ______, ranked by volume, floor price and other statistics.</p>
                    {/* Navigation Buttons */}
                <div className="flex justify-center mb-8">
                    <div className="flex justify-between items-center mb-8">
                    <button className="marketplace-button">
                    Marketplace Performance
                    </button>
                    <div className="flex items-center space-x-4 ml-4 justify-end"> 
                 <button className="brands-button ml-4"  onClick={() => router.push("/UsersAdmin")}>
                   Users
                        </button>
                   <button className="brands-button ml-4"onClick={() => router.push("/brandsAdmin")}>
                    Brands
                  </button> 
                    </div>

                    </div>       
                </div>

                  {/* Data Table */}
        <table className="w-full text-left">
               {/* Table Headers */}
         <thead>
        <tr className="text-gray-400">
            <th className="py-2">Collection</th>
            <th className="py-2">Volume</th>
            <th className="py-2">24H%</th>
            <th className="py-2">Floor Price</th>
            <th className="py-2">Owners</th>
            <th className="py-2">Items</th>
        </tr>
        </thead>
          {/* Table Body */}
    <tbody>
        {data.map((element, index) => (
            <tr key={index} className="border-b border-gray-700">
                  {/* Collection Info Cell */}
                <td className="py-4 flex items-center space-x-2">
                    <span className="text-purple-500">{element.id}</span>

                    <img src={element.logo} alt={`${element.name} logo`} className="w-10 h-10 rounded-full" />

                    <span>{element.name}</span>

                    {element.verified === 1 && (
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#0047ff' }} />
                    )}
                </td>
                  {/* Other Data Cells */}
                <td className="py-4">{element.volume}</td>
                <td className="py-4 text-green-500">{element.day}</td>
                <td className="py-4">{floorPrice[element.id] || 0}</td>
                <td className="py-4">{element.owner}</td>
                <td className="py-4">{items[element.id] || 0}</td>
            </tr>
            
        ))}
    </tbody>
        </table>
            </main>
        </div>
    );
};

export default Admin;
