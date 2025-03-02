"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X, LogOut, Utensils, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from '@/context/CartContext'
import CartModal from '@/components/CartModal'

export default function Navbar() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { itemCount, isCartOpen, setIsCartOpen, items, updateQuantity, removeItem } = useCart();
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  // Add bounce animation when itemCount changes
  useEffect(() => {
    if (itemCount > 0) {
      setIsCartBouncing(true);
      const timeout = setTimeout(() => setIsCartBouncing(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [itemCount]);

  // Check if the user is logged in
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (!token || !userData) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      const user = JSON.parse(userData)
      setIsAdmin(user.role === "ADMIN")
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Auth check failed:", error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setIsMenuOpen(false)
    window.location.href = "/"
  }

  if (isLoading) {
    return <div className="h-16 w-full bg-white shadow animate-pulse"></div>
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white">
                <Utensils className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Viriot Foods</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-8">
              <div className="flex items-center space-x-6">
                <NavLink href="/menu" active={pathname === "/menu"}>
                  Menu
                </NavLink>

                {isAuthenticated && (
                  <>
                    <NavLink href="/orders" active={pathname === "/orders"}>
                      My Orders
                    </NavLink>
                    {isAdmin && (
                      <NavLink href="/adminDashboard" active={pathname === "/adminDashboard"}>
                        <div className="flex items-center gap-1.5">
                          <Settings className="w-4 h-4" />
                          <span>Admin</span>
                        </div>
                      </NavLink>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className={`relative rounded-full p-2 text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600 ${
                    isCartBouncing ? 'animate-bounce' : ''
                  }`}
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-medium text-white">
                      {itemCount}
                    </span>
                  )}
                </button>

                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-200"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      className="rounded-full border border-green-600 px-4 py-1.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative rounded-full p-2 text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600 ${
                  isCartBouncing ? 'animate-bounce' : ''
                }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-medium text-white">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(true)}
                className="rounded-full p-2 text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMenuOpen(false)}>
            <div
              className="absolute right-0 top-0 h-full w-[280px] bg-white p-5 shadow-xl transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white">
                    <Utensils className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">Viriot Foods</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1">
                <MobileNavLink href="/menu" active={pathname === "/menu"} onClick={() => setIsMenuOpen(false)}>
                  Menu
                </MobileNavLink>

                {isAuthenticated && (
                  <>
                    <MobileNavLink href="/orders" active={pathname === "/orders"} onClick={() => setIsMenuOpen(false)}>
                      My Orders
                    </MobileNavLink>
                    {isAdmin && (
                      <MobileNavLink href="/adminDashboard" active={pathname === "/adminDashboard"} onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center gap-1.5">
                          <Settings className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </div>
                      </MobileNavLink>
                    )}
                  </>
                )}

                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="mt-4 flex w-full items-center gap-2 rounded-lg bg-red-100 px-4 py-3 text-left font-medium text-red-600 transition-colors hover:bg-red-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                ) : (
                  <div className="mt-6 grid gap-3">
                    <Link
                      href="/login"
                      className="w-full rounded-lg border border-green-600 px-4 py-2.5 text-center font-medium text-green-600 transition-colors hover:bg-green-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-center font-medium text-white transition-colors hover:bg-green-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </>
  )
}

interface NavLinkProps {
  href: string
  active?: boolean
  children: React.ReactNode
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-green-600 ${
        active ? "text-green-600" : "text-gray-700"
      }`}
    >
      {children}
    </Link>
  )
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void
}

function MobileNavLink({ href, active, onClick, children }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-green-50 hover:text-green-600 ${
        active ? "bg-green-50 text-green-600" : "text-gray-700"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

