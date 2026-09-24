#!/usr/bin/env bash
set -e

mkdir -p EnviroRise_Images/{01_management_and_team,02_about_company,03_services_and_home,04_reviews_and_gallery}

echo "Downloading 01 Management & Team images..."
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=85" -o "EnviroRise_Images/01_management_and_team/hari_nandiwal_director.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85" -o "EnviroRise_Images/01_management_and_team/ravi_sharma_director.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/khushboo_agarwal_architect.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/rekha_sharma_social_impact.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/ganesh_sharma_env_engineer.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/vijay_chaudhary_civil_engineer.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/aadi_sirswa_architect.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/rakesh_gis_expert.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/neeraj_sharma_ehs_expert.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/nisha_chaudhary_botanist.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/mukesh_kumar_drone_survey.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/mahesh_sharma_env_officer.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/01_management_and_team/dimple_tailor_chemical_engineer.jpg"

echo "Downloading 02 About Company images..."
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85" -o "EnviroRise_Images/02_about_company/hq_cassandra_business_tower.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/02_about_company/credentials_engineers_site.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/02_about_company/credentials_green_facade.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/02_about_company/credentials_blueprints_hands.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/02_about_company/credentials_esg_dashboard.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/02_about_company/credentials_water_sampling.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/02_about_company/credentials_clean_energy_model.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/02_about_company/credentials_scale_architecture.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/02_about_company/credentials_circular_economy_tablet.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=85" -o "EnviroRise_Images/02_about_company/commitments_sapling_planting.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=85" -o "EnviroRise_Images/02_about_company/commitments_pristine_river.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=85" -o "EnviroRise_Images/02_about_company/commitments_solar_wind_farm.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=85" -o "EnviroRise_Images/02_about_company/commitments_earth_moss_globe.jpg"

echo "Downloading 03 Services & Home images..."
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85" -o "EnviroRise_Images/03_services_and_home/home_about_engineers_collaboration.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=85" -o "EnviroRise_Images/03_services_and_home/service_clearances_paperwork.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1000&q=85" -o "EnviroRise_Images/03_services_and_home/service_assessment_drone_operator.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=85" -o "EnviroRise_Images/03_services_and_home/service_monitoring_lab_kit.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85" -o "EnviroRise_Images/03_services_and_home/service_audit_green_headquarters.jpg"

echo "Downloading 04 Reviews & Gallery images..."
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/04_reviews_and_gallery/reviews_built_environment.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/04_reviews_and_gallery/reviews_industry_manufacturing.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/04_reviews_and_gallery/reviews_renewable_energy.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/04_reviews_and_gallery/reviews_research_academia.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=85" -o "EnviroRise_Images/04_reviews_and_gallery/reviews_transport_logistics.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85" -o "EnviroRise_Images/04_reviews_and_gallery/gallery_analytical_lab_nabl.jpg"
curl -sL -A "Mozilla/5.0" "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1000&q=85" -o "EnviroRise_Images/04_reviews_and_gallery/gallery_community_rural_outreach.jpg"

echo "Packaging into ZIP..."
zip -r EnviroRise_Clearance_All_Images.zip EnviroRise_Images/
echo "Done! EnviroRise_Clearance_All_Images.zip created successfully."
