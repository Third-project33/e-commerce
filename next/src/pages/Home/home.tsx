import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import Navbar from './navbar';
// import Footer from './footer';
import './Home.css';

const Home = () => {
  interface Product {
    id: number;
    title: string;
    image: string;
    price: number;
    rarity: string;
    chains: string;
    status?: string; 
  }
  interface Brand {
    id: number;
    name: string;
    logo?: string;
    description?: string;
    verified?: number; 
  }
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get('http://localhost:3000/products');
        setProducts(productsResponse.data.slice(0, 9));

        const newProducts = productsResponse.data
          .filter((product: Product) => product.status === "New") 
          .slice(0, 3);
        setTrendingProducts(newProducts);

        const creatorsResponse = await axios.get('http://localhost:3000/user/all');
        setCreators(creatorsResponse.data.slice(0, 3));

        const brandsResponse = await axios.get('http://localhost:3000/brands/allbrands');
        const verifiedBrands = brandsResponse.data
        .filter((brand: Brand) => brand.verified === 1) 
        .slice(-3);
      setBrands(verifiedBrands);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLike = (productId: number) => {
    setLikedProducts(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  return (
    <div className="home">
      {/* <Navbar /> */}
      <div className="content-wrapper">
        <div className="tabs">
          <button className="tab active">Main Collection</button>
          <button className="tab" onClick={() => router.push('/products')}>Creators Market</button>
        </div>

        <div className="hero">
          <div className="hero-content">
            <h1>Clothes are the Spirit of Fashion</h1>
            <p>Fashion is an expression of individuality and creativity. It reflects our culture and personal style.</p>
            <div className="hero-buttons">
              <button className="explore-btn" onClick={() => router.push('/products')}>Explore Now</button> 
              <button className="create-btn" onClick={() => router.push('/create-product')}>Create</button>         
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Brands</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">20k+</span>
                <span className="stat-label">Fashion Designer</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">60+</span>
                <span className="stat-label">Fashion Shows</span>
              </div>
            </div>
          </div>

          <div className="gallery">
            <div className="gallery-item small">
              <img src="/src/assets/home-pictures/5.png" alt="Purple Shoes" />
            </div>
            <div className="gallery-item small">
              <img src="/src/assets/home-pictures/6.png" alt="Yellow Shoes" />
            </div>
            <div className="gallery-item tall">
              <img src="/src/assets/home-pictures/7.png" alt="Gold Dress" />
            </div>
            <div className="gallery-item medium">
              <img src="/src/assets/home-pictures/3.png" alt="Blue Jacket" />
            </div>
            <div className="gallery-item medium">
              <img src="/src/assets/home-pictures/4.png" alt="Shoes Display" />
            </div>
            <div className="gallery-item small">
              <img src="/src/assets/home-pictures/2.png" alt="Green Shoes" />
            </div>
            <div className="gallery-item small">
              <img src="/src/assets/home-pictures/1.png" alt="Character" />
            </div>
          </div>
        </div>

        <div className="brands">
          <img src="/src/assets/home-pictures/Adidas_logo.png" alt="Adidas" className="brand-logo" />
          <img src="/src/assets/home-pictures/Puma-logo-PNG.png" alt="Puma" className="brand-logo" />
          <img src="/src/assets/home-pictures/lacoste-logo.png" alt="Lacoste" className="brand-logo" />
        </div>

        <div className="about">
          <h2>About Us</h2>
          <p>Discover the latest trends and styles that define the fashion industry today.</p>
        </div>

        <div className="fashion-speaks">
          <div className="fashion-image">
            <img src="/src/assets/home-pictures/image 1.png" alt="Fashion Statue" />
          </div>
          <div className="fashion-content">
            <h2>Fashion That Speaks</h2>
            <p>
              Explore our diverse collection that caters to every taste and occasion.
              Join us in celebrating the art of fashion and the stories behind each piece.
              Stay updated with the latest news and insights from the fashion world.
            </p>
            <button className="show-more-btn">Show more</button>
          </div>
        </div>

        <div className="all-collection">
          <h2>All Collection</h2>
          <p>Worlds First Layer 2 Fashion Marketplace</p>
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">
                <img src="/src/assets/home-pictures/tag.png" alt="No Gas Fees" />
              </div>
              <h3>No Gas Fees</h3>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <img src="/src/assets/home-pictures/nft.png" alt="Carbon Natural NFTs" />
              </div>
              <h3>Carbon Natural NFTs</h3>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <img src="/src/assets/home-pictures/fleshet.png" alt="Fast And Easy Transactions" />
              </div>
              <h3>Fast And Easy Transactions</h3>
            </div>
          </div>
        </div>

        <div className="featured-products">
          <h2>Featured Products</h2>
          <p>Explore our latest collection</p>
          <div className="collection-tabs">
            <button className="collection-tab active">All Collections</button>
            <button className="collection-tab">Verified Brands</button>
            <button className="collection-tab">Verified Artists</button>
            <button className="collection-tab">New Drops</button>
            <button className="collection-tab">Live Shows</button>
          </div>
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <div className="product-info">
                  <div className="product-header">
                    <span className={`rarity-badge ${product.rarity.toLowerCase().replace(' ', '-')}`}>
                      {product.rarity}
                    </span>
                    <span className="chains">{product.chains}</span>
                  </div>
                  <div className="product-title-price">
                    <h2 className="product-title">{product.title}</h2>
                    <span className="product-price">{product.price.toLocaleString()} ETH</span>
                  </div>
                  <div className="product-footer">
                    <button
                      className={`like-button ${likedProducts.includes(product.id) ? 'liked' : ''}`}
                      onClick={() => handleLike(product.id)}
                    >
                      {likedProducts.includes(product.id) ? '❤️' : '🤍'}
                    </button>
                    <button className="buy-button" onClick={() => router.push('/products')}>
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="new-trending">
          <h2>New & Trending</h2>
          <p>Most popular digital fashion items</p>
          <div className="trending-grid">
            {trendingProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <div className="product-info">
                  <div className="product-header">
                    <span className={`rarity-badge ${product.rarity.toLowerCase().replace(' ', '-')}`}>
                      {product.rarity}
                    </span>
                    <span className="chains">{product.chains}</span>
                  </div>
                  <div className="product-title-price">
                    <h2 className="product-title">{product.title}</h2>
                    <span className="product-price">{product.price.toLocaleString()} ETH</span>
                  </div>
                  <div className="product-footer">
                    <button
                      className={`like-button ${likedProducts.includes(product.id) ? 'liked' : ''}`}
                      onClick={() => handleLike(product.id)}
                    >
                      {likedProducts.includes(product.id) ? '❤️' : '🤍'}
                    </button>
                    <button className="buy-button" onClick={() => router.push('/products')}>
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="upcoming-brands">
          <h2>Upcoming Brands</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <div className="brands-grid">
            {brands.map(brand => (
              <div key={brand.id} className="brand-card">
                <div className="brand-image">
                  <img src={brand.logo || '/default-brand-logo.png'} alt={brand.name} />
                </div>
                <div className="brand-profile">
                  <img src={brand.logo || '/default-brand-logo.png'} alt={brand.name} className="brand-avatar" />
                  <span className="brand-name">{brand.name} <span className="verified">✓</span></span>
                </div>
                <p className="brand-description">{brand.description || 'No description available.'}</p>
                <button className="follow-button">+ Follow</button>
              </div>
            ))}
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Question</h2>
          <p className="faq-subtitle">Wanna Ask Something?</p>
          <div className="faq-grid">
            {Array(6).fill(null).map((_, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question">
                  <span>Lorem ipsum ipsum ?</span>
                  <button className="expand-btn">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quality-banner">
          <div className="banner-content">
            <h2>Highest Quality</h2>
            <h2>Collection</h2>
            <button className="get-started-btn">Get Started</button>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;