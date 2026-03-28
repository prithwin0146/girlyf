# Jos Alukkas Online - Complete Pages Structure Analysis

> **Source**: Deep analysis of Angular 12 SPA bundles from `josalukkasonline.com`  
> **Framework**: Angular 12.0.5 + Angular Universal (SSR shell)  
> **Fonts**: Roboto, Poppins, Century Gothic (custom `gl-ff-CenturyGothic`)  
> **Primary Colors**: Gold `#e9bb2c` / `#e6c765` / `#ffc40c`, Dark `#4a3c12`, White, Black  

---

## 1. LOGIN PAGE (`/account/login` → routes to `/sign-in`)

### Layout
- Centered card/form layout with padding
- Brand heading: **"Sign In"**
- Subtext: **"Please sign in to your Jos Alukkas Account."**
- Two login modes accessible from the same page

### Form Fields (Mode 1: Password Login - `SignInForm`)
| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Username | text | Phone or Email validator | Validates against API (`ValidateUsername`) |
| Password | password (toggleable) | Required | Eye icon toggle (`hidePassword`) for show/hide |
| Device | hidden | Pre-filled | Stored device identifier |

### Form Fields (Mode 2: OTP Login - `SignInOtpForm`)
| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Username | text | Phone validator (mobile only) | Only mobile numbers accepted for OTP |
| OTP | ng-otp-input component | Required | 6-digit OTP input widget |
| Device | hidden | Pre-filled | Stored device identifier |

### OTP Flow
1. User enters mobile → clicks "SUBMIT"
2. API validates username → sends OTP via `SentMobileOtp()`
3. Step 3: OTP verification screen with countdown timer (180s / 3 min)
4. "Resend OTP?" link appears when timer expires
5. Verification calls `UserOTPLogin()`

### Buttons & Links
- **"SUBMIT"** button (primary action)
- **"Sign In with OTP"** - switches to OTP mode
- **"Forgot Password?"** - navigates to `/forgot-password`
- **"Sign Up"** - navigates to `/sign-up`
- **"VERIFY"** button (in OTP verification step)
- **"Resend OTP?"** link (after timer expires)
- **"Return to Sign In"** - goes back to password mode

### Auth Logic
- No social login (Google/Facebook) — entirely phone/email + password or OTP
- `LoginType` determined by API: "Mobile" or "Email"  
- Session uses JWT stored in localStorage
- Logged-in users auto-redirected to home (`/`)

### Styling
- Gold accent colors (`#e9bb2c`)
- Century Gothic font family
- Material Design snackbar for error messages
- Password visibility toggle with eye icon

---

## 2. REGISTER PAGE (`/account/register` → routes to `/sign-up`)

### Layout
- Multi-step registration wizard
- Brand heading: **"Sign Up"**
- Subtext: **"Please Sign Up to your Jos Alukkas Account."**

### Step 1: Username Validation (`SignUpForm` partial)
| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Username | text | Phone/Email validator | Checks if already registered via API |

### Step 2: OTP Verification
- **Mobile**: SMS OTP sent to mobile number
- **Email**: Email OTP sent to email address
- ng-otp-input component for entering OTP
- Countdown timer: **180 seconds (3 minutes)**
- "Resend OTP?" available after timer expires
- "VERIFY" button to confirm OTP

### Step 3: Password Setup (`SignUpForm` remaining)
| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Password | password (toggleable) | Required | Eye icon toggle (`hidePassword`) |
| Confirm Password | password (toggleable) | Must match Password | Separate `CpasswordForm` control, eye toggle (`hidePassword1`) |

### Step 4: Profile Completion (`SignUpForm2`)
| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| FirstName | text | Required | |
| Email | email | Email validator | Pre-filled if registered via email |
| Mobile | text | Phone validator, max 10 chars | Pre-filled if registered via mobile |

### Full Form Fields (combined)
```
SignUpForm: Id, FirstName, LastName, Username, Email, Mobile, Password, Status("Created")
SignUpForm2: FirstName, Email, Mobile
CpasswordForm: Confirm Password (separate control)
```

### Buttons & Links
- **"SUBMIT"** button at each step
- **"VERIFY"** button for OTP step
- **"Forgot Password?"** link
- **"Sign In"** link to login page
- Terms agreement text: "By clicking on Submit, you are agreeing to our terms & conditions"

### Auth Logic
- `LoginType` detected: "Mobile" or "Email" based on username
- OTP verification required before proceeding
- Auto-redirect to home if already logged in
- Status set to "Created" on registration

---

## 3. CART PAGE (`/cart` → routes to `/mycart`)

### Layout
- Shopping bag header: **"Shopping Bag (X)"** where X = item count
- Two sections: Shopping Bag + Saved for Later
- Right sidebar: Price Summary

### Cart Item Display
Each item shows:
| Element | Details |
|---------|---------|
| Product Image | Loaded from `ImgUrl + "large_" + ProductImage`, lazy loading with placeholder |
| Product Name | Clickable, links to `/products/detail/:sku/:priceId` |
| Selling Price | Current price display |
| Original Price | Strikethrough if discounted (`OgSellingPrice`) |
| Actual Total Value | Calculated total |
| Quantity Selector | Dropdown/select (mat-select), max 5 items; if >5, different UI |
| Remove Button | Per-item remove (`RemoveFromCartList`) |

### Quantity Controls
- Material Select dropdown (`selectionChange` event)
- Options: 1-5 quantity
- If quantity > 5: special handling
- `onChangePrice()` recalculates on quantity change

### Price Summary Sidebar
| Line Item | Details |
|-----------|---------|
| **Price (X items)** | Shows total price with item count |
| **Selling Price** | Shows if discounted (lower than total) |
| **Coupon Discount** | Shown when coupon applied |
| **Can Apply Coupons** | Link/button to apply coupon |
| **Estimated Total** | Final calculated total |

### Saved for Later Section
- Separate list with "Saved Items" heading
- **"Remove All"** button to clear all saved items
- Individual remove buttons per item
- **"Add To Cart"** button to move item back to cart
- Same product display format as cart items
- Separate `SavedQuantity` array

### Actions
- **"Remove All"** - clears entire cart or saved list
- **"continue to checkout"** button → calls `ContinueToCheckout()`
- **"Continue Shopping"** link → back to products

### Empty Cart State
- **"Your cart is empty!"** message
- **"Add items to it now."** subtext

### Trust Badges
- "Safe and secure payments. Easy returns. 100% Authentic products"

### Styling
- Gold-themed cart badge on header icon
- Box shadows for cards
- Material components for quantity select
- Responsive layout (mobile-friendly)

---

## 4. BLOG PAGE (`/blogs/news`)

### Analysis
- **NOT part of the Angular SPA** — the `/blogs/news` URL is NOT a route in the Angular app's route table
- The blogs section appears to be hosted on a **separate platform** (likely Shopify or a CMS subdomain)
- No `BlogModule` found in any lazy-loaded chunk
- Only a `VideosModule` exists at `/videos` route within the Angular app

### Likely Structure (based on typical Jos Alukkas blog pattern)
- Blog posts rendered server-side via CMS
- News/blog content fetched externally
- Content managed through a headless CMS

---

## 5. STORE LOCATOR (`/pages/store-locator` → routes to `/store-locator`)

### Layout
- Page title: **"Store Locator"**
- Search filters at top
- Store detail card below
- Photo gallery section: **"Stores Photo Gallery"**

### Search/Filter Controls
| Control | Type | Details |
|---------|------|---------|
| Select State | mat-select dropdown | Loads all states with active stores (`GetAllStateByActiveLocation`) |
| Select Location/District | mat-select dropdown | Cascading: loads districts by selected state (`GetAllDistrictByStateNoJWT`) |
| Search Button | Button (`.search_btn`) | Gold background `#ffe699`, rounded pill shape |

### Default State
- Pre-selected: State ID `1826` (likely Kerala)
- Districts load automatically for default state

### Store Detail Card
| Element | Details |
|---------|---------|
| Store Image | From CMS: `cmsUrl + LocationData.Image` |
| Store Address | `LocationData.Address` |
| Embedded Map | Google Maps iframe (`LocationData.EmbedMap`) sanitized via Angular DomSanitizer |
| Round Logo | Circular logo overlay (145px × 145px, gold border, positioned at top) |

### All Stores Map
- Default embedded Google Maps with all store locations
- URL: `https://www.google.com/maps/d/u/0/embed?mid=1VRXh-MGSM7btDCV_0KD8Eak5-eZyHg8&ehbc=2E312F&noprof=1`

### Product Quick View (within store page)
- Products available at the store can be browsed
- Calculation engine for prices (GoldValue, LabourValue, DiamondValue, CST etc.)

### API Endpoints Used
- `GetAllStateByActiveLocation()` — fetch states
- `GetAllDistrictByStateNoJWT(stateId)` — fetch districts
- `GetAllStoreByFilters(districtId)` — fetch store details

### Store Count
- **60+ physical stores** across India (extracted from individual store routes):
  - Kerala, Tamil Nadu, Karnataka, Telangana, Andhra Pradesh, Puducherry

### Styling
- Gold borders and accents
- Box shadows
- Rounded search button (pill shape)
- Image gallery with hover zoom effect
- Responsive grid layout

---

## 6. ABOUT US (`/pages/about-us` → routes to `/aboutus`)

### Page Sections (in order)

#### Section 1: Hero / Page Title
- `AboutUsData.PageTitle` — dynamic title from CMS
- `AboutUsData.Description1` — first paragraph (brand intro)
- About Logo: `cmsUrl + AboutUsData.AboutLogo`
- Gold rounded top section (`.about_top_sec` with `border-radius: 100px`)

#### Section 2: Brand Description
- `AboutUsData.Description2` — extended brand story
- Rich text (HTML content via `innerHTML`)
- Text color: `#4a3c12` (dark gold/brown)

#### Section 3: Founder Section
- Heading: **"FOUNDER"**
- `AboutUsData.FounderDescription` — founder bio
- Positioned with `.founder_top` (offset -70px for visual overlap)

#### Section 4: Board / Management Directors (`MDList`)
- Sorted list of managing directors/leadership team
- Rendered as sorted cards
- Image + description for each

#### Section 5: Milestones / Features
| Feature | Icon |
|---------|------|
| Feature 1 | `assets/images/about/diamond.png` |
| Feature 2 | `assets/images/about/icon4.png` |
| Feature 3 | `assets/images/about/icon1.png` |
| Feature 4 | `assets/images/about/icon2.png` |
| Feature 5 | `assets/images/about/digi-gold.png` |
| Feature 6 | `assets/images/about/icon3.png` |
- Three feature descriptions: `FeatureDescription1`, `FeatureDescription2`, `FeatureDescription3`
- Milestone widths: 28% and 18% columns
- Grid with gold borders and dividers

#### Section 6: Faces / Team List (`FacesList`)
- Circular portrait images (170px × 170px, gold border)
- Team member cards

#### Section 7: Collections Section
- Heading: **"JOS ALUKKAS EXCLUSIVE COLLECTIONS"**
- `AboutUsData.CollectionList` — sorted collection showcase

#### Section 8: Online Store
- Heading: **"ONLINE STORE"**
- Gold bottom section (`.about_bottom_sec` with rounded bottom)

### Styling
- Gold background `#e6c765` for hero and bottom sections
- Rounded corners (100px on desktop, 50px on mobile)
- Gold border dividers between sections
- Circular portrait frames for team
- Text color: `#4a3c12` (dark brown-gold)
- Hover zoom on product images

---

## 7. CONTACT US (`/pages/contact-us` → routes to `/contactus`)

### Layout
- Page title from CMS: `ContactData.PageTitle`
- Hero image: `cmsUrl + ContactData.Image`
- Two-column layout: Contact info + Enquiry form

### Contact Information (from CMS)
| Element | Source |
|---------|--------|
| Get In Touch text | `ContactData.GetInTouch` |
| Physical Address | `ContactData.Address` |
| Corporate Office | `ContactData.CorporateOffice` |
| WhatsApp | Direct link: `https://api.whatsapp.com/send?phone=918606083922` |
| Live Chat | URL: `https://webbot.me/815ef2401000caa9cd550e507249b89aea1415bc34ccc70447f2f1fd859f6116` |
| Contact Icon | `assets/images/contact/contact-icon.png` |
| Chat Icon | `assets/images/contact/chat.png` |

### Enquiry Form (`ContactForm`)
| Field | Type | Validation | Label |
|-------|------|------------|-------|
| Name | mat-form-field | Required | "First Name" / "Last Name" |
| Email | mat-form-field | Email validator | "Email" |
| Phone | mat-form-field | Phone validator | "Phone" |
| Message | textarea | Required | "Message" |
| Type | hidden | "ContactUs" | Auto-set |
| CAPTCHA | Math captcha | Must be correct | Addition of two random numbers |

### Anti-spam
- Math CAPTCHA: `LeftNumber + RightNumber = ?` (random numbers, refreshes on each submit)

### Sections
1. **"Enquiry Form"** — contact form
2. **"Live Chat Support"** — links to webbot chat
3. **Common Email component** — reusable email/share widget (`Subject: "Contact Us"`)

### Success Message
- "Thank You for Contacting us!! We will be get in touch with you shortly!!"

### API Endpoint
- `CreateEnquiryForm()` — submits the form data
- Theme data from `GetActiveTheme()` → `InnerHomeTheme.ContactUs`

### Styling
- Left gold border accent on sections
- Hover background effect (`#fff3ce`)
- Image gallery with zoom and overlay effects
- Responsive: 47%/53% split on desktop, 100% on mobile

---

## 8. WISHLIST (`/wishlist`)

### Layout
- Header: **"My Wishlist (X)"** where X = item count
- Grid/list of wishlist items
- **"Remove All"** button at top

### Item Card Display
| Element | Details |
|---------|---------|
| Product Image | Lazy loaded: `ImgUrl + "large_" + ProductImage` |
| Product Name | Clickable, links to `/products/detail/:sku/:priceId` |
| Selling Price | Current price |
| Ring Size | Shown if applicable (`RingSize`) |

### Actions Per Item
| Action | Button Text | Details |
|--------|-------------|---------|
| Remove | Remove/X icon | `RemoveFromWishlist()` |
| Add to Cart | **"ADD TO CART"** | `AddToCart()` — moves item to cart |
| Share | **"SHARE"** | Opens share dialog component (`app-share` with `share-buttons`) |

### Guest vs Logged-in Wishlist
- **Guest users**: Wishlist stored in `localStorage` (`GuestWishList` key)
- **Logged-in users**: Wishlist stored server-side (`WishList` in storage)
- On login: Guest wishlist merges with server wishlist (`replaceGuestWishlistOnLogin`)

### Price Drop Alert
- System checks if gold rate has changed since item was wishlisted
- Compares rates for: 22KT, 24KT, 18KT, 14KT, PT(950), 92.5, 80, 70, 65
- Shows dialog: "Price drop found for the Product(s) _[name]_! Shop Now and Save your money."

### Empty State
- **"Your wishlist is empty!"**
- **"Add items to it now."**

### Styling
- Product cards with hover effects
- Share button with material icon
- Gold accent theme
- Responsive grid

---

## 9. FAQ PAGE (`/pages/faq` → routes to `/faq`)

### Layout
- Page title: **"FAQ"**
- Subtitle: **"Frequently Asked Questions - www.josalukkasonline.com"**
- Content rendered from CMS in a card with box shadow

### Content Structure
- **NOT traditional accordion** — uses a flat list of heading/description pairs
- Content loaded from `ContentData.FAQ` (array from CMS API)
- Each FAQ item has:
  - `Heading` — displayed as bold uppercase section title (`.inner_sub_head`, Century Gothic font)
  - `Description` — rendered as HTML via `[innerHTML]` (rich text with lists and formatting)

### FAQ Rendering Pattern
```
<div *ngFor="let item of ContentData.FAQ">
  <div *ngIf="item.Heading">{{ item.Heading }}</div>       <!-- Section title -->
  <div *ngIf="item.Description" [innerHTML]="item.Description"></div>  <!-- Rich HTML content -->
</div>
```

### Pincode Checker Section
Built into the FAQ page:
| Field | Details |
|-------|---------|
| Heading | **"Do you ship to my location(Pincode)?"** |
| Input | Text field with placeholder: "Enter Your Pincode" |
| Validation | Required, min 6 chars, max 6 chars |
| Button | **"Check Now"** (gold border, uppercase) |

### Pincode Check Results
- **Delivery Available**: "We deliver to [PinCode], [Description], [ServiceCenter]" (green text)
- **Delivery Not Available**: "Sorry, Secure shipping service not available in this pincode [PinCode]."
- **Fallback**: "Don't worry! Contact our Customer care on 0091 8606083922 for alternative delivery option."

### API
- `GetAllContentByFilters()` → fetches FAQ content from CMS
- `Shipping/CheckPincode/` → checks delivery availability

### Styling
- Box shadow container (`.common-box-shadow`)
- Gold border on "Check Now" button (hover: gold bg + white text)
- Green text for positive delivery messages
- List-style icons for answer content
- Century Gothic font throughout

---

## 10. CHECKOUT FLOW (`/checkout`)

### Access
- **Auth required** — guarded by `canActivate: [AuthGuard]`
- Redirects to sign-in if not logged in

### Checkout Tabs/Steps (Accordion-style, `activeTab` state)

#### Tab 1 (activeTab=1): Personal Details (auto-filled)
| Field | Source |
|-------|--------|
| Name | `UserData.FirstName + UserData.LastName` |
| Mobile | `UserData.Mobile` |
| Email | `UserData.Email` |

#### Tab 2 (activeTab=2): Billing Address
| Field | Source |
|-------|--------|
| Name | `BillingAddress.FirstName + LastName` |
| Mobile | `BillingAddress.Mobile` |
| Type | "Home" / "Work" / "Other" |
| Full Address | `BillingAddress.FullAddress` (or computed from components) |
- **"CHANGE"** button to modify
- Address remove option available

#### Tab 3 (activeTab=3): Shipping/Delivery Address
| Field | Source |
|-------|--------|
| Name | `ShippingAddress.FirstName + LastName` |
| Mobile | `ShippingAddress.Mobile` |
| Type | "Home" / "Work" / "Other" |
| Full Address | `ShippingAddress.FullAddress` |
- Indian address validation: 10-digit mobile, 6-digit postal code
- Country must be "India" for domestic shipping

#### Address Form (`ContactForm` for new addresses)
| Field | Type | Validation |
|-------|------|------------|
| EnterTitle | text | - |
| EmailAddress | email | Email validator |
| FirstName | text | Required |
| LastName | text | Required |
| PhoneNumber | text | Phone validator |
| PinCode | text | Required, 6 digits |
| HouseName | text | Required |
| Address | text | Required |
| CityDistrictTown | text | Required |
| State | text | Required |
| Country | text | Required |
| Landmark | text | Optional |
| AlternatePhone | text | Optional |

- **"SAVE AND CONTINUE"** button after address

#### Tab 4 (activeTab=4): Order Review / Product Preview
- Product list with images, names, prices
- SKU links to product detail
- Price breakdown per item (SellingPrice, OgSellingPrice)
- "No Preview" fallback for missing images

#### Tab 5 (activeTab=5): Coupons & Offers
| Feature | Details |
|---------|---------|
| **Coupon Code** | Text input: "Enter your Coupon Code" + **"APPLY"** button |
| **Gift Voucher (QC Coupon)** | Text input: "Enter your gift voucher code here" + Pin: "Enter Card Pin" |
| **Special Offers** | Auto-detected `SpecialOfferData` with min amount requirement |
| **Digi Gold Wallet** | OTP-verified digital gold wallet redemption |
| Multiple Coupons | Can add multiple gift vouchers ("Add More" button) |
| Validated Voucher | Shows validated voucher details and total |
| Remove Coupon | Per-coupon remove button |
| Silver restriction | "Coupon is not applicable for an order with Silver Jewellery" |
| Gold Coin restriction | "Coupon is not applicable for an order with Gold Coin" |

#### Digi Gold Wallet Flow
1. Step 0: "Kindly verify your account with OTP for using Digi wallet"
2. Step 1: Enter mobile number → Send OTP → Verify
3. Step 2: Enter redeem amount ("Type Your Redeem Amount") → **"REDEEM NOW"**
4. Validation: Cannot exceed total bill amount or wallet balance
5. Success: "Successfully redeemed from DIGI wallet"

#### Tab 6: Payment Options
| Payment Method | Identifier |
|---------------|------------|
| **PhonePe** | `PaymentMethods.PhonePe` |
| **CCAvenue** | `PaymentMethods.CCAvenue` |
- Default method from `PaymentMethods.DefaultPaymentMethod`
- Active state highlighted with `.payment_type_active` class
- Validation: "Please select your payment method"

#### CCAvenue Sub-options (likely)
| Option |
|--------|
| CREDIT CARD |
| DEBIT CARD |
| NET BANKING |

### Order Summary Sidebar
| Line | Calculation |
|------|-------------|
| Item Prices | Sum of all items |
| You Saved | `totalPrice - totalSellingPrice` |
| Coupon Discount | Applied coupon amount |
| Voucher Discount | Gift voucher total |
| Special Discount | Special offer amount |
| Digi Wallet | Redeemed amount |
| Net Weight Discount | `TotalNetWtDiscountRs` |
| Shipping | "Free Nationwide" / "Free" |
| **Estimated Total** | `totalSellingPrice - CouponTotal - QCCouponAmount - digiRedeemAmount - SpecialOffer - NetWtDiscount` |

### Order Form Fields (`OrderForm`)
```
Id, UserId, Name, Username, Email, Mobile,
Currency(1), CurrencyCode("INR"), PaymentType("INR"),
CouponCode, CouponApplied, SpecialOffers, SpecialDelivery,
NearByShop, PaymentMethod, PaymentResponse, PaymentData, PaymentStatus,
AdminMessage, OrderType("Product"),
BillingAddress, ShippingAddress, Amount
```

### Final Step
- **CAPTCHA** verification: "Enter the characters" text input
- **"Confirm Order"** button
- Pincode check: `Shipping/CheckPincode/` for delivery verification
- OTP form for wallet: `VerifyOtpForm` with `customerRefNo`

### Trust Indicators
| Icon | Text |
|------|------|
| 🔒 | SSL |
| 🚚 | Free Nationwide (Shipping) |
| ✅ | Trusted |
| 💎 | Gurantee [sic] |

---

## 11. ORDER TRACKING (`/ordertrack`)

### Access
- Public access (no auth guard) — uses order ID from query params
- URL: `/ordertrack?id=<orderId>`

### Layout
- Page title: **"My Track"**
- Order total displayed: **"ORDER TOTAL: ₹XX,XXX"**
- Delivery icon: `assets/images/myaccount/delivery.svg`

### Order Status Steps (Stepper)
| Step # | Status | DateTime |
|--------|--------|----------|
| 0 | Order Initiated | timestamp |
| 1 | Payment Pending | timestamp |
| 2 | Payment Confirmed | timestamp |
| 3 | Order Placed | timestamp |
| 4 | Order Processed | timestamp |
| 5 | Order Dispatched | timestamp |
| 6 | Order Delivered | timestamp |
| 7 | (Cancelled/Returned) | if applicable |

### Status Logic
- Each status has `Status` text and `DateTime`
- Status[7] = Cancellation/Return status (checked separately)
- If `Status[6]` exists: show "Delivery Expected on: [date]"
- If `Status[7]` exists: show cancelled/returned state
- Visual: Active steps highlighted, completed steps checked

### Expected Delivery Calculation
```javascript
ExpectedDate = CreateDate + (CustomizeDeliveryDate ? ExpectedDayCount : 
               DeliveryType === "Request" ? 10 : 5) days
```

### Data Displayed
- Order list items
- Billing Address (parsed from JSON)
- Shipping Address (parsed from JSON)
- Order total
- Individual item statuses

### API
- `GetOrdersByIdWithOutJWT(id)` — fetches order without auth token

### Styling
- Gold borders between sections (`.border_btm_common`, `.jos-border`)
- Status stepper with icons
- Date formatting via Angular date pipe

---

## 12. GIFT CARDS (`/gift-cards`)

### Layout
- Hero banner: `cmsUrl + MenuImageData.GiftCard.BannerImage` (desktop)
- Responsive banner: `MenuImageData.GiftCard.ResBannerImage` (mobile)
- Large heading: **"Gift Card"** (60px font, responsive down to 24px mobile)

### Page Sections

#### Section 1: Gift Card Introduction
- Heading: **"Gifts..."**
- Description: "Want to surprise your special ones with their favourite jewellery? Our gift cards are just the picks for you. Available in different denominations, this allows your dear ones to buy jewellery of their choice with just a click. Your loved one can buy any studded jewellery from any of the Jos Alukkas Jewellery outlet or from www.josalukkasonline.com"

#### Section 2: Gift Card Denominations
- Loaded from `GetAllCouponAmount(0, 0)` API
- Each coupon displays: `CouponName` and `Amount` (JSON parsed)
- **"BUY NOW"** button per denomination

#### Section 3: Gift Card Usage Info
- "Funds will be deducted from your e-Gift Voucher at the time you place your order. In case of any adjustment or cancellation at a later stage, we will (re)issue funds as credit to your voucher"

#### Section 4: Bulk Purchase
- "For purchase of more than five gift vouchers call us on or write to us for assistance. Our representative will help you in picking the appropriate gift for any occasion."
- Email: `ecomsupport@alukkasgroup.com`

### Navigation
- **"BUY NOW"** links to `/gift-cards/buy-gift-cards` (BuyGiftCardsModule in chunk 2906)
- **Gift Policy** link to `/gift-policy`

### Styling
- Large hero banner
- Discount badge (circular, 50px, yellow `#ffeb00`)
- Responsive image handling with opacity transitions
- Gold theme consistent

---

## 13. MY ACCOUNT DASHBOARD (`/myaccount`)

### Access
- **Auth required** — `canActivate: [AuthGuard]`

### Navigation Menu Items
| # | Icon | Active Icon | Label | Route |
|---|------|-------------|-------|-------|
| 1 | myorder.svg | myorder-clr.svg | **MY ORDERS** | `/myaccount/order` |
| 2 | Message.svg | Message-clr.svg | **(Wishlist/Messages)** | `/myaccount/wishlist` |
| 3 | wallet_icon.svg | wallet_icon-clr.svg | **My Wallet** | `/myaccount/digiwallet` |
| 4 | profile.svg | profile-clr.svg | **ACCOUNT SETTINGS** | `/myaccount/account` |
| 5 | help.svg | help-clr.svg | **(Help/Support)** | `/myaccount/help` |
| 6 | Logout.svg | Logout.svg | **(Logout)** | Logout action |

### Layout
- Left sidebar with menu items
- User avatar icon (`login.svg`)
- User name displayed (`my_account_name`)
- Material hover effects (`.myaccount_hover`)
- Gold-themed with box shadows

### Wallet Section
- **"My Wallet"** — Digi Gold digital wallet
- New account wallet indicator (`.new-ac-wallets`)
- Links to Digi Gold features

---

## 14. FORGOT PASSWORD (`/forgot-password`)

### Form Flow
- Loaded from chunk 5519 (ForgotPasswordModule)
- Multi-step: Username → OTP → New Password
- Similar pattern to registration OTP flow
- Shared validation with login components

---

## 15. LOYALTY / REWARDS PROGRAM

### Analysis
- **No dedicated loyalty/rewards module** found in the route table
- **Digi Gold Wallet** serves as the loyalty/wallet system:
  - Accessible via `/myaccount/digiwallet`
  - Digital gold balance can be redeemed at checkout
  - OTP verification required for transactions
  - Balance check and redemption features
- **No points-based rewards program** detected
- Special offers applied via coupon codes at checkout

---

## 16. COMPLETE ROUTE MAP

### Core Pages
| Route | Module | Chunk IDs |
|-------|--------|-----------|
| `/` | HomeModule | 7333, 8592, 1060 |
| `/sign-in` | LoginModule | 8592, 6591 |
| `/sign-up` | RegisterModule | 8592, 3211 |
| `/forgot-password` | ForgotPasswordModule | 8592, 5519 |
| `/products` | ListingModule | 7333, 8592, 4626 |
| `/detail` | DetailModule | 7333, 6330, 8592 |
| `/mycart` | MycartModule | 8592, 7847 |
| `/checkout` | CheckoutModule (auth) | 8592, 3660 |
| `/wishlist` | MyWishlistModule | 7333, 8592, 3957 |
| `/myaccount` | MyaccountModule (auth) | 7408 |
| `/ordertrack` | OrderTrackingModule | 8592, 4556 |
| `/success` | OrderSuccessModule | 3884 |

### Info Pages
| Route | Module | Chunk IDs |
|-------|--------|-----------|
| `/aboutus` | AboutusModule | 8540 |
| `/history` | HistoryModule | 433 |
| `/contactus` | ContactModule | 8592, 6273 |
| `/store-locator` | StoreLocaterModule | 7333, 8592, 5296 |
| `/faq` | FaqModule | 7212 |
| `/terms-and-conditions` | TermsModule | 3002 |
| `/shipping-policy` | ShippingPolicyModule | 3154 |
| `/cancellation-policy` | CancellationModule | 62 |
| `/privacy-policy` | PrivacyPolicyModule | 6262 |
| `/return-exchange-policy` | ReturnExchangeModule | 180 |
| `/gift-policy` | GiftcardModule | 8073 |
| `/gift-cards` | GiftsModule → BuyGiftCardsModule | 8592, 4933 → 2906 |
| `/payments` | PaymentFaqModule | 3213 |
| `/education` | EducationModule | 8922 |
| `/career` | CareerModule | 1771 |
| `/feedback` | FeedbackModule | 4436 |
| `/online-feedback` | OnlineFeedbackModule | 1470 |
| `/sitemap` | SitemapModule | 2258 |
| `/csr` | CsrModule | 1664 |

### Product Categories
| Route | Module |
|-------|--------|
| `/gold-jewellery` | ListingModule |
| `/diamond-jewellery` | ListingModule |
| `/platinum-jewellery` | ListingModule |
| `/silver-jewellery` | ListingModule |
| `/kids-jewellery` | ListingModule |
| `/18k-jewellery` | ListingModule |
| `/gold-coin` | ListingModule |

### Special Features
| Route | Module |
|-------|--------|
| `/digi-gold` | DigiGoldModule |
| `/compare` | CompareModule |
| `/ring-size-guide` | RingSizeModule |
| `/bangle-size-guide` | BangleSizeModule |
| `/gold-rate-today` | GoldRateTodayModule (50+ location variants) |
| `/videos` | VideosModule |
| `/akshaya-tritiya` | AkshayaTritiyaModule |
| `/valentine-collection` | ValentineCollectionModule |
| `/customize-products` | CustomizeProductsModule |
| `/gold-coin-make-on-request` | CustomizeGoldCoinModule |
| `/deals` | SplDayOfferModule |
| `/weekend-sale` | WeekendSaleModule |
| `/offer-zone` | OfferZoneModule |

### Store Pages
- `/jewellery-store/:store` — 60+ individual store pages (StoreDetailModule)

---

## 17. SHARED INFRASTRUCTURE

### Common Services
| Service | Purpose |
|---------|---------|
| `CommonService` | Data formatting, sorting, focus control |
| `StorageService` | localStorage wrapper for JWT, cart, wishlist, user data |
| `ThemeService` | CMS content fetching (`GetActiveTheme`, `GetAllContentByFilters`) |
| `UserService` | Auth, profile, enquiry forms |
| `OrderService` | Order management, coupon validation |
| `ShippingService` | Pincode check, delivery validation |
| `LocationsService` | Store locator data |
| `DigiService` | Digi Gold wallet operations |

### Global State (localStorage keys)
| Key | Purpose |
|-----|---------|
| `JWT` | Auth token |
| `UserId` | User identifier |
| `Device` | Device fingerprint |
| `Cart` | Cart with GoldRate snapshot |
| `WishList` | Server-synced wishlist |
| `GuestWishList` | Guest user wishlist |
| `UserData` | User profile |
| `GoldRateData` | Current gold rates |
| `MenuImageData` | Navigation images |

### API Base
- API base URL configured via environment (`apiURI`, `imageURI`, `cmsURI`)
- JWT auth via Authorization header
- Content-Type: application/json

### Design System Classes (prefix: `gl-`)
| Pattern | Purpose |
|---------|---------|
| `gl-w-{n}` | Width percentage |
| `gl-h-{n}p` | Height in pixels |
| `gl-d-flex` | Flexbox display |
| `gl-fd-column/row` | Flex direction |
| `gl-justify-{sb/fs/fe/c}` | Justify content |
| `gl-align-{center/fs}` | Align items |
| `gl-fs-{n}` | Font size |
| `gl-fw-{n}` | Font weight |
| `gl-px/py/p-{n}` | Padding |
| `gl-mx/my/m-{n}` | Margin |
| `gl-bg-{color}` | Background |
| `gl-text-{color}` | Text color |
| `gl-ff-CenturyGothic` | Font family |
| `gl-tt-{u/c}` | Text transform |
| `gl-lh-{n}` | Line height |
| `gl-po-{rel/abs/fix/sti}` | Position |
| `gl-cursor-p` | Cursor pointer |
| `gl-of-{hide/y-auto}` | Overflow |
| `gl-zindex-{n}` | Z-index |
| `gl-xs-{*}`, `gl-sm-{*}`, `gl-md-{*}`, `gl-xl-{*}`, `gl-xxl-{*}` | Responsive breakpoints |
| `hvr-wobble` | Hover animation |
| `common-box-shadow` | Box shadow utility |

---

## 18. KEY TAKEAWAYS FOR GIRLYF CLONE

### Must-Have Pages
1. ✅ Login (email/phone + password, OTP mode)
2. ✅ Register (multi-step with OTP verification)
3. ✅ Cart (with saved items, quantity controls, price summary)
4. ✅ Checkout (accordion steps: personal → billing → shipping → review → coupons → payment)
5. ✅ Wishlist (with share, move-to-cart, price drop alerts)
6. ✅ Store Locator (state → district cascade, embedded maps)
7. ✅ About Us (CMS-driven sections with founder, team, milestones)
8. ✅ Contact (form with captcha, WhatsApp, live chat)
9. ✅ FAQ (CMS-driven Q&A list with pincode checker)
10. ✅ Order Tracking (7-step status stepper)
11. ✅ Gift Cards (denominations, buy flow, voucher redemption)
12. ✅ My Account (orders, wishlist, wallet, settings, help)

### Payment Methods
- PhonePe (UPI)
- CCAvenue (Credit Card, Debit Card, Net Banking)
- Digi Gold Wallet (balance redemption)
- Gift Vouchers (card number + PIN)

### No Loyalty Points System
- Use Digi Gold Wallet as the equivalent loyalty mechanism
- No traditional points earn/burn program detected

### No Blog Module in SPA
- Blog/news content hosted externally
- Consider implementing as CMS pages or a separate module
