-- ════════════════════════════════════════════════════════════
-- GIRLYF – Complete Seed Data (v2 – Local Image Paths)
-- Run AFTER EF Core creates tables via EnsureCreated()
-- ════════════════════════════════════════════════════════════

-- ── PRODUCTS ── (30 jewellery items across all 10 categories)
-- CategoryIds: 1=Necklace, 2=Earring, 3=Bangle, 4=Ring, 5=Bracelet,
--              6=Pendant, 7=Chain, 8=Anklet, 9=Mangalsutra, 10=Nose Pin

INSERT INTO "Products" ("Name","Slug","Description","SKU","CategoryId","Metal","Karat","GrossWeight","NetWeight","StoneWeight","Purity","MakingChargePercent","WastagePercent","StonePrice","BasePrice","Gender","Collection","Occasion","IsBestSeller","IsFeatured","IsNewArrival","IsActive","StockQuantity","DisplayOrder","CreatedAt","UpdatedAt") VALUES
('Lakshmi Haar Gold Necklace','lakshmi-haar-gold-necklace','Exquisite traditional Lakshmi haar necklace with intricate temple work and antique finish. Perfect for weddings and festivals.','GF-NK-001',1,'Gold','22K',45.500,43.000,2.500,'916',14.00,5.00,8500.00,0,'Women','Bridal','Wedding',true,true,false,true,5,1,NOW(),NOW()),
('Mango Mala Designer Necklace','mango-mala-designer-necklace','Classic mango mala design in 22K gold with traditional South Indian craftsmanship. A timeless bridal piece.','GF-NK-002',1,'Gold','22K',38.200,36.000,2.200,'916',12.00,5.00,6200.00,0,'Women','Heritage','Wedding',true,true,false,true,3,2,NOW(),NOW()),
('Diamond Solitaire Pendant Necklace','diamond-solitaire-pendant-necklace','Modern diamond solitaire pendant necklace in 18K white gold with a brilliant cut diamond.','GF-NK-003',1,'Gold','18K',12.800,10.500,2.300,'750',18.00,3.00,45000.00,0,'Women','Modern','Daily Wear',false,true,true,true,8,3,NOW(),NOW()),
('Jhumka Traditional Earrings','jhumka-traditional-earrings','Stunning gold jhumkas with delicate filigree work and pearl drops. A must-have for every South Indian bride.','GF-ER-001',2,'Gold','22K',18.500,17.000,1.500,'916',15.00,5.00,3200.00,0,'Women','Heritage','Festival',true,true,false,true,10,1,NOW(),NOW()),
('Diamond Stud Earrings','diamond-stud-earrings','Elegant diamond stud earrings in 18K gold with VS clarity solitaire diamonds. Perfect for everyday luxury.','GF-ER-002',2,'Gold','18K',6.200,4.800,1.400,'750',20.00,3.00,52000.00,0,'Women','Modern','Daily Wear',true,false,true,true,12,2,NOW(),NOW()),
('Chandbali Pearl Earrings','chandbali-pearl-earrings','Grand chandbali earrings with crescent moon design, encrusted with uncut kundan stones and pearl drops.','GF-ER-003',2,'Gold','22K',22.300,20.500,1.800,'916',16.00,5.00,5500.00,0,'Women','Bridal','Wedding',false,true,true,true,6,3,NOW(),NOW()),
('Broad Kerala Bangle Set','broad-kerala-bangle-set','Set of 4 broad Kerala-style gold bangles with traditional kasavu pattern. Handcrafted by master artisans.','GF-BG-001',3,'Gold','22K',62.000,60.500,1.500,'916',10.00,4.00,2800.00,0,'Women','Heritage','Wedding',true,true,false,true,4,1,NOW(),NOW()),
('Diamond Sleek Bangle','diamond-sleek-bangle','Contemporary diamond-studded sleek bangle in 18K rose gold. Minimalist luxury for the modern woman.','GF-BG-002',3,'Gold','18K',15.800,13.200,2.600,'750',22.00,3.00,38000.00,0,'Women','Modern','Daily Wear',false,true,true,true,7,2,NOW(),NOW()),
('Antique Kada Bangle','antique-kada-bangle','Heavy antique gold kada with intricate Nakashi work. A statement piece for traditional occasions.','GF-BG-003',3,'Gold','22K',35.000,34.000,1.000,'916',12.00,5.00,1500.00,0,'Women','Heritage','Festival',true,false,false,true,5,3,NOW(),NOW()),
('Solitaire Diamond Ring','solitaire-diamond-ring','Premium solitaire diamond engagement ring in platinum setting with 1 carat VS1 diamond.','GF-RG-001',4,'Gold','18K',5.800,4.200,1.600,'750',25.00,2.00,125000.00,0,'Women','Modern','Engagement',true,true,false,true,3,1,NOW(),NOW()),
('Classic Gold Band','classic-gold-band','Timeless 22K gold band with a smooth polished finish. Perfect for everyday wear.','GF-RG-002',4,'Gold','22K',8.500,8.200,0.300,'916',8.00,3.00,500.00,0,'Men','Everyday','Daily Wear',true,false,true,true,15,2,NOW(),NOW()),
('Navratna Ring','navratna-ring','Traditional navratna ring in 22K gold with nine precious gemstones representing the nine planets.','GF-RG-003',4,'Gold','22K',10.200,8.500,1.700,'916',14.00,5.00,9800.00,0,'Unisex','Heritage','Festival',false,true,false,true,6,3,NOW(),NOW()),
('Tennis Diamond Bracelet','tennis-diamond-bracelet','Luxurious tennis bracelet with 42 round brilliant diamonds in 18K white gold. Total diamond weight 5.2 carats.','GF-BR-001',5,'Gold','18K',18.500,12.800,5.700,'750',20.00,2.00,185000.00,0,'Women','Modern','Party',true,true,false,true,2,1,NOW(),NOW()),
('Mens Gold Link Bracelet','mens-gold-link-bracelet','Bold 22K gold link chain bracelet for men. Contemporary design with a secure lobster clasp.','GF-BR-002',5,'Gold','22K',28.000,27.500,0.500,'916',10.00,4.00,800.00,0,'Men','Modern','Daily Wear',false,true,true,true,8,2,NOW(),NOW()),
('Kids Charm Bracelet','kids-charm-bracelet','Adorable 22K gold charm bracelet for kids with star, heart, and moon motifs. Adjustable length.','GF-BR-003',5,'Gold','22K',6.500,6.200,0.300,'916',12.00,5.00,400.00,0,'Kids','Kids','Daily Wear',false,false,true,true,10,3,NOW(),NOW()),
('Om Gold Pendant','om-gold-pendant','Sacred Om pendant in 22K hallmarked gold with diamond-cut finish. Comes with a matching chain.','GF-PD-001',6,'Gold','22K',4.800,4.500,0.300,'916',15.00,5.00,600.00,0,'Unisex','Spiritual','Daily Wear',true,true,false,true,20,1,NOW(),NOW()),
('Heart Diamond Pendant','heart-diamond-pendant','Romantic heart-shaped pendant studded with tiny diamonds in 18K white gold. Perfect Valentine gift.','GF-PD-002',6,'Gold','18K',3.200,2.400,0.800,'750',22.00,3.00,18500.00,0,'Women','Modern','Gifting',false,true,true,true,12,2,NOW(),NOW()),
('Ganesha Gold Pendant','ganesha-gold-pendant','Beautifully crafted Lord Ganesha pendant in 22K gold with enamel detailing.','GF-PD-003',6,'Gold','22K',6.500,6.200,0.300,'916',14.00,5.00,500.00,0,'Unisex','Spiritual','Festival',true,false,false,true,15,3,NOW(),NOW()),
('Bismark Gold Chain','bismark-gold-chain','Premium 22K Bismark chain for men. 24-inch length with a sturdy lobster clasp.','GF-CH-001',7,'Gold','22K',25.000,24.800,0.200,'916',8.00,3.00,0.00,0,'Men','Modern','Daily Wear',true,true,false,true,6,1,NOW(),NOW()),
('Rope Chain 18K','rope-chain-18k','Elegant 18K gold rope chain. 20-inch length, perfect for pendants.','GF-CH-002',7,'Gold','18K',12.500,12.300,0.200,'750',10.00,3.00,0.00,0,'Women','Everyday','Daily Wear',false,false,true,true,10,2,NOW(),NOW()),
('Kids Ball Chain','kids-ball-chain','Delicate 22K gold ball chain for children. 16-inch length with secure clasp.','GF-CH-003',7,'Gold','22K',5.000,4.900,0.100,'916',12.00,5.00,0.00,0,'Kids','Kids','Daily Wear',false,true,false,true,15,3,NOW(),NOW()),
('Traditional Gold Anklet Pair','traditional-gold-anklet-pair','Pair of traditional gold anklets with small dangling bells. Handcrafted in 22K gold.','GF-AK-001',8,'Gold','22K',18.000,17.500,0.500,'916',12.00,5.00,1200.00,0,'Women','Heritage','Wedding',true,true,false,true,8,1,NOW(),NOW()),
('Modern Sleek Anklet','modern-sleek-anklet','Minimalist gold anklet with tiny diamond accents in 18K gold. Adjustable chain length.','GF-AK-002',8,'Gold','18K',5.200,4.500,0.700,'750',18.00,3.00,8500.00,0,'Women','Modern','Daily Wear',false,false,true,true,12,2,NOW(),NOW()),
('Bridal Mangalsutra Long','bridal-mangalsutra-long','Traditional bridal mangalsutra in 22K gold with black bead chain. 30-inch length with ornate pendant.','GF-MS-001',9,'Gold','22K',32.000,30.000,2.000,'916',12.00,5.00,4500.00,0,'Women','Bridal','Wedding',true,true,false,true,5,1,NOW(),NOW()),
('Modern Diamond Mangalsutra','modern-diamond-mangalsutra','Contemporary mangalsutra with diamond-studded pendant in 18K gold. Short length for modern brides.','GF-MS-002',9,'Gold','18K',10.500,8.200,2.300,'750',20.00,3.00,32000.00,0,'Women','Modern','Wedding',false,true,true,true,7,2,NOW(),NOW()),
('Daily Wear Mangalsutra','daily-wear-mangalsutra','Lightweight mangalsutra for everyday wear in 22K gold. Delicate single-line black bead chain.','GF-MS-003',9,'Gold','22K',8.000,7.500,0.500,'916',10.00,4.00,800.00,0,'Women','Everyday','Daily Wear',true,false,true,true,15,3,NOW(),NOW()),
('Diamond Nose Pin Stud','diamond-nose-pin-stud','Petite diamond nose pin in 18K white gold. Single solitaire diamond with screw-back fitting.','GF-NP-001',10,'Gold','18K',1.200,0.800,0.400,'750',25.00,2.00,12000.00,0,'Women','Modern','Daily Wear',true,true,false,true,20,1,NOW(),NOW()),
('Traditional Gold Nose Ring','traditional-gold-nose-ring','Classic gold nose ring (nath) in 22K gold with pearl drop. Perfect for traditional occasions.','GF-NP-002',10,'Gold','22K',3.500,3.200,0.300,'916',15.00,5.00,1200.00,0,'Women','Heritage','Wedding',false,true,true,true,10,2,NOW(),NOW()),
('Floral Nose Pin','floral-nose-pin','Dainty floral nose pin in 22K gold with small ruby center stone. Secure press-fit mechanism.','GF-NP-003',10,'Gold','22K',1.800,1.500,0.300,'916',18.00,5.00,2500.00,0,'Women','Everyday','Daily Wear',true,false,false,true,18,3,NOW(),NOW()),
('Kundan Choker Necklace','kundan-choker-necklace','Royal kundan choker necklace in 22K gold with uncut polki diamonds and emerald drops. A showstopper bridal piece.','GF-NK-004',1,'Gold','22K',55.000,50.000,5.000,'916',16.00,5.00,25000.00,0,'Women','Bridal','Wedding',false,false,true,true,2,4,NOW(),NOW());

-- ── PRODUCT IMAGES ── (all local paths)
INSERT INTO "ProductImages" ("ProductId","ImageUrl","IsPrimary","DisplayOrder") VALUES
(1,'/assets/images/products/necklace-1.jpg',true,1),
(1,'/assets/images/products/necklace-2.jpg',false,2),
(2,'/assets/images/products/necklace-3.jpg',true,1),
(2,'/assets/images/products/necklace-4.jpg',false,2),
(3,'/assets/images/products/necklace-4.jpg',true,1),
(4,'/assets/images/products/earring-1.jpg',true,1),
(4,'/assets/images/products/earring-2.jpg',false,2),
(5,'/assets/images/products/earring-2.jpg',true,1),
(6,'/assets/images/products/earring-3.jpg',true,1),
(7,'/assets/images/products/bangle-1.jpg',true,1),
(7,'/assets/images/products/bangle-2.jpg',false,2),
(8,'/assets/images/products/bangle-2.jpg',true,1),
(9,'/assets/images/products/bangle-3.jpg',true,1),
(10,'/assets/images/products/ring-1.jpg',true,1),
(11,'/assets/images/products/ring-2.jpg',true,1),
(12,'/assets/images/products/ring-3.jpg',true,1),
(13,'/assets/images/products/bracelet-1.jpg',true,1),
(14,'/assets/images/products/bracelet-2.jpg',true,1),
(15,'/assets/images/products/bracelet-3.jpg',true,1),
(16,'/assets/images/products/pendant-1.jpg',true,1),
(17,'/assets/images/products/pendant-2.jpg',true,1),
(18,'/assets/images/products/pendant-3.jpg',true,1),
(19,'/assets/images/products/chain-1.jpg',true,1),
(20,'/assets/images/products/chain-2.jpg',true,1),
(21,'/assets/images/products/chain-3.jpg',true,1),
(22,'/assets/images/products/anklet-1.jpg',true,1),
(23,'/assets/images/products/anklet-2.jpg',true,1),
(24,'/assets/images/products/mangalsutra-1.jpg',true,1),
(24,'/assets/images/products/mangalsutra-2.jpg',false,2),
(25,'/assets/images/products/mangalsutra-2.jpg',true,1),
(26,'/assets/images/products/mangalsutra-3.jpg',true,1),
(27,'/assets/images/products/nosepin-1.jpg',true,1),
(28,'/assets/images/products/nosepin-2.jpg',true,1),
(29,'/assets/images/products/nosepin-3.jpg',true,1),
(30,'/assets/images/products/necklace-1.jpg',true,1);

-- ── BANNERS ── (local hero + mid banners)
INSERT INTO "Banners" ("Title","SubTitle","ImageUrl","MobileImageUrl","LinkUrl","Position","IsActive","DisplayOrder") VALUES
('New Bridal Collection 2025','Discover timeless elegance','/assets/images/banners/hero-1.avif','/assets/images/banners/hero-1-mobile.avif','/gold-jewellery/necklaces','hero',true,1),
('Flat 10% Off on Diamond Jewellery','Use code SPARKLE10 at checkout','/assets/images/banners/hero-2.avif','/assets/images/banners/hero-2-mobile.avif','/diamond-jewellery','hero',true,2),
('Gold Rate Today','Live rates updated daily','/assets/images/banners/hero-3.avif',NULL,'/gold-rate','hero',true,3),
('Exclusive Wedding Collection','Up to 25% off on making charges','/assets/images/banners/hero-4.avif',NULL,'/gold-jewellery','hero',true,4),
('Summer Jewellery Fest','Up to 25% off on making charges','/assets/images/misc/mid-banner-1.jpg',NULL,'/gold-jewellery','mid',true,1),
('Diamond Sparkle Sale','Extra 5% off on diamond jewellery','/assets/images/misc/mid-banner-2.jpg',NULL,'/diamond-jewellery','mid',true,2);

-- ── BLOG POSTS ── (local images)
INSERT INTO "BlogPosts" ("Title","Slug","Excerpt","Content","FeaturedImageUrl","Author","Tags","IsPublished","PublishedAt","CreatedAt") VALUES
('How to Choose the Perfect Bridal Necklace','how-to-choose-perfect-bridal-necklace','A complete guide to selecting the ideal necklace for your wedding day, covering styles, karats, and budget tips.','<h2>Finding Your Dream Bridal Necklace</h2><p>Your wedding necklace is one of the most important pieces of jewellery you''ll ever own. From traditional temple jewellery to contemporary diamond pieces, the options are endless.</p><h3>Consider Your Outfit</h3><p>The necklace should complement your bridal attire. For a traditional silk saree, opt for a classic Lakshmi haar or mango mala. For a modern lehenga, consider a kundan choker or diamond set.</p><h3>Gold Karat Guide</h3><p>22K gold is the traditional choice for Indian bridal jewellery due to its rich colour and durability. 18K gold is preferred for diamond-studded pieces.</p><h3>Budget Planning</h3><p>Set a budget early and explore options within that range. Making charges vary from 8% to 25% depending on complexity.</p>','/assets/images/blog/bridal-necklace.jpg','Girlyf Editorial','bridal,necklace,wedding,guide',true,NOW() - INTERVAL '5 days',NOW() - INTERVAL '5 days'),
('Understanding Gold Purity: 18K vs 22K vs 24K','understanding-gold-purity-18k-22k-24k','Everything you need to know about gold karats, purity levels, and which one is right for your jewellery.','<h2>Gold Purity Decoded</h2><p>Understanding karat values is essential when shopping for gold jewellery.</p><h3>24K Gold (99.9% Pure)</h3><p>The purest form of gold. Too soft for regular jewellery, but used for coins and bars.</p><h3>22K Gold (91.6% Pure)</h3><p>The most popular choice for traditional Indian jewellery. Look for the BIS 916 hallmark.</p><h3>18K Gold (75% Pure)</h3><p>Preferred for diamond and stone-studded jewellery. Available in yellow, white, and rose gold. Look for the 750 hallmark.</p>','/assets/images/blog/gold-purity.jpg','Girlyf Editorial','gold,purity,karat,education',true,NOW() - INTERVAL '10 days',NOW() - INTERVAL '10 days'),
('Top 5 Jewellery Trends for 2025','top-5-jewellery-trends-2025','From layered necklaces to statement rings, discover the hottest jewellery trends dominating 2025.','<h2>2025 Jewellery Trends</h2><p>This year is all about bold expression and personal style.</p><h3>1. Layered Necklaces</h3><p>Mix delicate chains with statement pendants.</p><h3>2. Chunky Gold Hoops</h3><p>Oversized gold hoops are making a massive comeback.</p><h3>3. Coloured Gemstones</h3><p>Rubies, emeralds, and sapphires are in demand.</p><h3>4. Minimalist Everyday Gold</h3><p>Lightweight gold pieces designed for daily wear.</p><h3>5. Personalized Jewellery</h3><p>Name pendants, birthstone rings, and custom engravings.</p>','/assets/images/blog/trends-2025.jpg','Girlyf Editorial','trends,2025,fashion,style',true,NOW() - INTERVAL '3 days',NOW() - INTERVAL '3 days'),
('Caring for Your Gold Jewellery: Maintenance Tips','caring-for-gold-jewellery-maintenance-tips','Learn how to keep your precious gold jewellery looking as beautiful as the day you bought it.','<h2>Gold Jewellery Care Guide</h2><p>Gold is durable, but proper care keeps it gleaming for generations.</p><h3>Daily Care</h3><p>Remove jewellery before bathing, swimming, or applying perfume.</p><h3>Cleaning at Home</h3><p>Soak in warm water with mild soap for 15 minutes, then gently brush with a soft toothbrush.</p><h3>Storage</h3><p>Store each piece separately in soft cloth pouches.</p><h3>Professional Servicing</h3><p>Get professional cleaning and polishing once a year.</p>','/assets/images/blog/gold-care.jpg','Girlyf Editorial','care,maintenance,tips,gold',true,NOW() - INTERVAL '7 days',NOW() - INTERVAL '7 days');

-- ── COUPONS ──
INSERT INTO "Coupons" ("Code","Description","DiscountType","DiscountValue","MinOrderAmount","MaxDiscount","UsageLimit","UsedCount","ValidFrom","ValidTo","IsActive") VALUES
('WELCOME10','10% off on your first order','percentage',10.00,10000.00,5000.00,100,0,NOW(),NOW() + INTERVAL '90 days',true),
('SPARKLE10','10% off on diamond jewellery','percentage',10.00,25000.00,15000.00,50,0,NOW(),NOW() + INTERVAL '60 days',true),
('FLAT2000','Flat ₹2000 off on orders above ₹50,000','flat',2000.00,50000.00,2000.00,200,0,NOW(),NOW() + INTERVAL '30 days',true);
