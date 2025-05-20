"use client";

import { useState, useEffect } from "react";
import { useProductContext } from "@/context/product-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Eye, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import ProductDetailModal from "./product-detail-modal";
import type { Product } from "@/types";
import { useInView } from "react-intersection-observer";

// Fungsi untuk preload gambar
const preloadImage = (src: string | undefined) => {
  if (!src) return;
  const img = document.createElement("img");
  img.src = src;
};

export default function Menu() {
  const { products, loading, error, filteredProducts, filterProducts } =
    useProductContext();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [descRef, descInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [filtersRef, filtersInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (products && products.length > 0) {
      products.forEach((product) => {
        if (product.image) preloadImage(product.image);
      });
    }
  }, [products]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    filterProducts(filter);
  };

  const handleProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    const productWithImage = {
      ...product,
      image:
        product.image ||
        `/img/products/${product.id}.jpg` ||
        "/placeholder.svg",
    };
    addToCart(productWithImage, 1);
    toast({
      title: "Ditambahkan ke Keranjang",
      description: `${product.name} telah ditambahkan ke keranjang Anda`,
    });
  };

  if (loading) {
    return (
      <section
        id="menu"
        className="menu py-20 dark:bg-gray-900 light:bg-amber-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="menu"
        className="menu py-20 dark:bg-gray-900 light:bg-amber-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500 text-center">
              <p className="text-xl font-medium">Gagal memuat produk</p>
              <p className="text-sm mt-2">Silakan coba lagi nanti</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="menu"
      className="menu py-20 dark:bg-gray-900 light:bg-amber-50"
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        .ripple-effect::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 0.4s ease-out;
        }
        .button-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            background 0.2s ease;
        }
        .button-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0, 170, 91, 0.2);
          background: #00aa5b;
        }
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <div className="container mx-auto px-4">
        <h2
          ref={titleRef}
          className={`text-3xl md:text-5xl font-bold text-center mb-6 dark:text-white light:text-amber-900 animate-fadeIn ${
            titleInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-amber-600 dark:text-amber-500 light:text-amber-700">
            Menu
          </span>{" "}
          Kami
        </h2>

        <p
          ref={descRef}
          className={`text-center max-w-3xl mx-auto mb-12 text-gray-700 dark:text-gray-300 text-base md:text-lg animate-fadeIn ${
            descInView ? "opacity-100" : "opacity-0"
          }`}
        >
          Nikmati ragam pilihan kopi, non-coffee, dan makanan favorit—dari
          espresso, matcha, sampai indomie rebus dan nasi goreng. Semua siap
          nemenin kamu ngebut project Next.js, debug Spring Boot, atau ngoding
          full-stack pake React, Laravel, Express, hingga Go dan Rust. Coding
          nyaman, perut kenyang, fokus pun auto optimal.
        </p>

        <div
          ref={filtersRef}
          className={`menu-filter flex flex-wrap justify-center gap-3 mb-10 animate-fadeIn ${
            filtersInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {[
            { id: "all", label: "Semua" },
            { id: "coffee", label: "Kopi" },
            { id: "non-coffee", label: "Non-Kopi" },
            { id: "snack", label: "Makanan Ringan" },
            { id: "main-course", label: "Main Course" },
            { id: "dessert", label: "Dessert" },
            { id: "indonesian-food", label: "Makanan Indonesia" },
            { id: "western-food", label: "Western Food" },
            { id: "instant-food", label: "Instant Food" },
          ].map((filter) => (
            <button
              key={filter.id}
              className={`filter-btn px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
              }`}
              onClick={() => handleFilterClick(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-filter text-center py-16">
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
              Tidak ada produk dalam kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card relative rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md card-hover"
                style={{
                  opacity: 0,
                  animation: `fadeIn 0.4s ease-out forwards ${index * 0.1}s`,
                }}
              >
                <div className="product-image relative h-60 overflow-hidden rounded-t-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10" />
                  <Image
                    src={
                      product.image ||
                      `/img/products/${product.id}.jpg` ||
                      "/placeholder.svg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      const alternativePaths = [
                        `/img/products/${product.id}.jpg`,
                        `/img/products/kopi-${product.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.jpg`,
                        `/img/products/${product.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.jpg`,
                      ];
                      const tryAlternativePath = (
                        paths: string[],
                        index = 0
                      ) => {
                        if (index >= paths.length) {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                          return;
                        }
                        const imgEl = document.createElement("img");
                        imgEl.onload = () => {
                          (e.target as HTMLImageElement).src = paths[index];
                        };
                        imgEl.onerror = () => {
                          tryAlternativePath(paths, index + 1);
                        };
                        imgEl.src = paths[index];
                      };
                      tryAlternativePath(alternativePaths);
                    }}
                  />
                </div>

                <div className="product-content p-5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white light:text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="stars flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-amber-500 fill-current"
                      />
                    ))}
                  </div>
                  <div className="price text-amber-600 dark:text-amber-500 font-bold text-xl mb-3">
                    Rp. {product.price.toLocaleString()}
                  </div>
                  <p className="description text-sm dark:text-gray-400 light:text-gray-600 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="product-icons flex gap-2">
                    <button
                      className="ripple-effect flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg text-white text-sm font-medium border border-gray-600 button-hover"
                      onClick={() => handleProductDetail(product)}
                    >
                      <Eye size={16} className="text-amber-500" />
                      <span>Lihat Detail</span>
                    </button>
                    <button
                      className="ripple-effect flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg text-white text-sm font-medium border border-gray-600 button-hover"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={16} className="text-amber-500" />
                      <span>Tambah ke Keranjang</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </section>
  );
}
