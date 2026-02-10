'use client';

import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';
import { FormWrapper } from '@/components/shared/FormWrapper';
import { GENDER, BLOOD_GROUP, MARITAL_STATUS } from '@/lib/constants/statuses';

const { TextArea } = Input;
const { Option } = Select;

// Nigerian States
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nassarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara', 'FCT'
];

// LGAs for each Nigerian State (Complete - All 36 States + FCT)
const NIGERIAN_LGAS: Record<string, string[]> = {
  'Abia': ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Isuikwuato', 'Nkporo', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu-Neochi'],
  'Adamawa': ['Demsa', 'Fufore', 'Ganye', 'Girei', 'Gombi', 'Guyuk', 'Hong', 'Jada', 'Lamurde', 'Madagali', 'Maiha', 'Mayo-Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'],
  'Akwa Ibom': ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat Enin', 'Nsit Atai', 'Nsit Ibom', 'Nsit Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo'],
  'Anambra': ['Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'],
  'Bauchi': ['Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa', 'Ganjuwa', 'Giade', 'Itas/Gadau', 'Jama\'are', 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 'Tafawa Balewa', ' Toro', 'Warji', 'Zaki'],
  'Bayelsa': ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
  'Benue': ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 'Otukpo', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'],
  'Borno': ['Abadam', 'Askira/Uba', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Jere', 'Kaga', 'Kala/Balge', 'Kukawa', 'Konduga', 'Kukawa', 'Mafa', 'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani'],
  'Cross River': ['Abi', 'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South', 'Etung', 'Ikom', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Yakurr', 'Yala'],
  'Delta': ['Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri North', 'Warri South', 'Warri South West'],
  'Ebonyi': ['Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North', 'Ezza South', 'Ikwo', 'Ishielu', 'Ivo', 'Izzi', 'Ohaozara', 'Ohaukwu', 'Onicha'],
  'Edo': ['Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba-Okha', 'Oredo', 'Orhionmwon', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 'Uhunmwonde'],
  'Ekiti': ['Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 'Gbonyin', 'Ido Osi', 'Ijero', 'Ikere', 'Ikole', 'Ilejemeje', 'Irepodun/Ifelodun', 'Ise/Orun', 'Moba', 'Oye'],
  'Enugu': ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo-Eze North', 'Igbo-Eze South', 'Isi-Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka', 'Oji River', 'Udenu', 'Udi', 'Uzo-Uwani'],
  'FCT': ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council'],
  'Gombe': ['Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 'Kwami', 'Nafada', 'Shongom', 'Yamaltu/Deba'],
  'Imo': ['Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 'Mbaitoli', 'Ngor-Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 'Obowo', 'Oguta', 'Ohaji/Egbema', 'Okigwe', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 'Owerri North', 'Owerri West'],
  'Jigawa': ['Auyo', 'Babura', 'Birni Kudu', 'Birnin Kudu', 'Buji', 'Dutse', 'Gagarawa', 'Garki', 'Gumel', 'Guri', 'Gwaram', 'Gwiwa', 'Hadejia', 'Jahun', 'Kafin Hausa', 'Kazaure', 'Kiri Kasamma', 'Kiyawa', 'Kaugama', 'Malam Madori', 'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankwashi'],
  'Kaduna': ['Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', 'Jema\'a', 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kawo', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Tudun Wada', 'Zangon Kataf', 'Zaria'],
  'Kano': ['Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nassarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Sabon Gari', 'Sandiramu', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'],
  'Katsina': ['Bakori', 'Batagarawa', 'Batsari', 'Baure', 'Bindawa', 'Charanchi', 'Daura', 'Dutsin Ma', 'Faskari', 'Funtua', 'Ingawa', 'Jibia', 'Jibi', 'Kafur', 'Kaita', 'Kankara', 'Kankia', 'Katsina', 'Kurfi', 'Kusada', 'Mai\'Adua', 'Malumfashi', 'Mani', 'Mashi', 'Matazu', 'Musawa', 'Rimi', 'Safana', 'Sandamu', 'Zango'],
  'Kebbi': ['Aleiro', 'Arewa Dandi', 'Argungu', 'Augie', 'Bagudo', 'Birnin Kebbi', 'Bunza', 'Dandi', 'Danko/Wasagu', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko/Besse', 'Maiyama', 'Ngaski', 'Sakaba', 'Shanga', 'Suru', 'Wasagu', 'Yauri', 'Zuru'],
  'Kogi': ['Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 'Igalamela-Odolu', 'Ijumu', 'Kabba/Bunu', 'Kogi', 'Lokoja', 'Mopa-Muro', 'Ofu', 'Ogori/Magongo', 'Okehi', 'Okene', 'Olamaboro', 'Omala', 'Yagba East', 'Yagba West'],
  'Kwara': ['Asa', 'Baruten', 'Edu', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 'Moro', 'Offa', 'Oke Ero', 'Oyun', 'Pategi'],
  'Lagos': ['Agege', 'Alimosho', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Amuwo-Odofin', 'Ajeromi-Ifelodun', 'Eti-Osa', 'Badagry', 'Apapa', 'Ibeju-Lekki', 'Epe', 'Isheri-Osun', 'Shomolu', 'Surulere', 'Oshodi-Isolo'],
  'Nassarawa': ['Akwanga', 'Awe', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Lafia', 'Nassarawa', 'Obi', 'Toto', 'Wamba'],
  'Niger': ['Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara', 'Katcha', 'Kontagora', 'Lapai', 'Lavun', 'Magama', 'Mariga', 'Mashegu', 'Mokwa', 'Munya', 'Paikoro', 'Rafi', 'Rijau', 'Shiroro', 'Suleja', 'Tafa', 'Wushishi'],
  'Ogun': ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North-East', 'Ijebu Ode', 'Ikenne', 'Imeko-Afon', 'Ipokia', 'Obafemi-Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Remo North', 'Sagamu', 'Yewa North', 'Yewa South'],
  'Ondo': ['Akoko North-East', 'Akoko North-West', 'Akoko South-West', 'Akoko South-East', 'Akure North', 'Akure South', 'Ese-Odo', 'Idanre', 'Ifedore', 'Igbara-Oke', 'Ilaje', 'Ile-Oluji/Okeigbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo West', 'Ondo East', 'Ose', 'Owo'],
  'Osun': ['Atakumosa East', 'Atakumosa West', 'Ayedaade', 'Ayedire', 'Boluwaduro', 'Boripe', 'Ede North', 'Ede South', 'Egbedore', 'Ejigbo', 'Ife Central', 'Ife East', 'Ife North', 'Ife South', 'Ifedayo', 'Ifelodun', 'Ila', 'Ilesa East', 'Ilesha West', 'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo-Otin', 'Ola-Oluwa', 'Olorunda', 'Oriade', 'Orolu', 'Osogbo'],
  'Oyo': ['Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Iwajowa', 'Kajola', 'Lagelu', 'Odo-Oluwa', 'Ogbomosho North', 'Ogbomosho South', 'Orire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
  'Plateau': ['Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua\'an Pan', 'Riyom', 'Shendam', 'Wase'],
  'Rivers': ['Abua/Odual', 'Ahoada East', 'Ahoada West', 'Akuku Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Eleme', 'Emuoha', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio/Akpor', 'Ogba/Egbema/Ndoni', 'Ogu/Bolo', 'Okrika', 'Omuma', 'Opobo/Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai'],
  'Sokoto': ['Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 'Gwadabawa', 'Illela', 'Isa', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'],
  'Taraba': ['Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo', 'Karim Lamido', 'Kurmi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari', 'Yorro', 'Zing'],
  'Yobe': ['Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gogaram', 'Gujba', 'Gulani', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'],
  'Zamfara': ['Anka', 'Bakura', 'Birnin Magaji/Kiyaw', 'Bukkuyum', 'Bungudu', 'Gummi', 'Gusau', 'Kaura Namoda', 'Kebbe', 'Maradun', 'Maru', 'Shinkafi', 'Talata Mafara', 'Tsafe', 'Zurmi'],
};

// Streets for each LGA (sample data - can be expanded)
const NIGERIAN_STREETS: Record<string, string[]> = {
  // Lagos Streets
  'Alimosho': ['Ipaja Road', 'Ayobo Road', 'Iyana Ipaja', 'Baruwa', 'Egbeda', 'Ikotun', 'Igando', 'Akesan', 'Ojo'],
  'Ikeja': ['Oba Akran', 'Awolowo Way', 'Adeniyi Jones', 'Opebi', 'Allen Avenue', 'Mobolaji Bank Anthony', 'Oregun', 'Ikeja GRA'],
  'Eti-Osa': ['Lekki-Epe Express', 'Adetokunbo Ademola', 'Akin Adesola', 'Ahmadu Bello Way', 'Kofo Abayomi', 'Gertrude Obara'],
  'Lagos Island': ['Broad Street', 'Marina', 'Campbell Street', 'Idumagbo Avenue', 'Nnamdi Azikiwe Street', 'Victoria Island'],
  'Lagos Mainland': ['Ikorodu Road', 'Herbert Macaulay', 'Adebayo Doherty', 'Jaiye Oyedotun', 'Mobolaji Johnson'],
  'Surulere': ['Adeniran Ogunsanya', 'Bode Thomas', 'Eric Moore', 'Randle Avenue', 'Funso Williams', 'Itire', 'Lawanson', 'Aguda'],
  'Apapa': ['Apapa Road', 'Warehouse Road', 'Liverpool Road', 'Creek Road', 'Point Road', 'Burma Road'],
  'Agege': ['Agege Motor Road', 'Ogunmokun Road', 'Mushin Road', 'Capitol Road', 'Baba Ode Street'],
  'Kosofe': ['Ikorodu Road', 'Ojota Road', 'Ketu-Ojota Express', 'Mende Road', 'Owode Onirin'],
  'Mushin': ['Agege Motor Road', 'Mushin Road', 'Olowu Street', 'Pako Street', 'Idi-Araba Road'],
  'Oshodi-Isolo': ['Oshodi-Apapa Express', 'Isolo Road', 'Mafoluku Road', 'Airport Road', 'Lateef Jakande'],
  'Shomolu': ['Shomolu Road', 'Bariga Road', 'Onipanu Road', 'Pedro Road', 'Bajulaiye Road'],
  'Ikorodu': ['Ikorodu Road', 'Sagamu Road', 'Igbogbo Road', 'Ijede Road', 'Ita-Elewa'],
  'Ibeju-Lekki': ['Lekki-Epe Express', 'Epe Road', 'Abijo Road', 'Awoyaya Road', 'Lakowe Road'],
  'Badagry': ['Badagry Express', 'Topo Road', 'Ajara Road', 'Gberefu Road', 'Mowo Road'],
  'Ajeromi-Ifelodun': ['Awolowo Road', 'Liverpool Road', 'Boundary Road', 'Ajegunle Road', 'Ojo Road'],
  'Ojo': ['Badagry Express', 'Ojo Road', 'Iganmu Road', 'Alaba Road', 'Maza-Maza Road'],
  'Amuwo-Odofin': ['Festac Road', 'Amuwo Road', 'Road 21', 'Road 22', '7th Avenue'],

  // Abuja Streets
  'Abaji': ['Abaji Road', 'Kutigi Street', 'Edeku Street', 'Odanto Street', 'Gwagwalada Road'],
  'Bwari': ['Bwari Road', 'Ushafa Road', 'Kubwa Road', 'Dutse Road', 'Jigo Road'],
  'Gwagwalada': ['Airport Road', 'Gwagwalada Road', 'Suleja Road', 'Zuba Road', 'Paiko Road'],
  'Kuje': ['Airport Road', 'Kuje Road', 'Gbadau Road', 'Kaso Road', 'Gwagwalada Road'],
  'Kwali': ['Airport Road', 'Kwali Road', 'Lokoja Road', 'Yaba Road', 'Kwalla Road'],
  'Municipal Area Council': ['Shehu Shagari Way', 'Ahmadu Bello Way', 'Cotton Street', 'Market Road', 'Wuse 2'],

  // Kano Streets
  'Dala': ['Kofar Mata', 'Naibawa Road', 'Gwauron Dutse', 'Kano Road', 'Zaria Road'],
  'Fagge': ['Fagge Road', 'Kwari Market', 'Saulawa Road', 'Kofar Wambai', 'Sharada Road'],
  'Gwale': ['Gwale Road', 'Koki Road', 'Kantin Kwari', 'Emir Palace Road', 'Zoo Road'],
  'Gwarzo': ['Gwarzo Road', 'Madobi Road', 'Kunchi Road', 'Wudil Road', 'Danbatta Road'],
  'Kano Municipal': ['Emir Palace Road', 'Kofar Kudu', 'Kofar Dan Agundi', 'Nassarawa Road', 'Ahmadu Bello Way'],
  'Kumbotso': ['Kumbotso Road', 'Bompai Road', 'Sharada Industrial', 'Jakara Road', 'Gwale Road'],
  'Kunchi': ['Kunchi Road', 'Gwarzo Road', 'Madobi Road', 'Kano Road', 'Danbatta Road'],
  'Madobi': ['Madobi Road', 'Kunchi Road', 'Gwarzo Road', 'Wudil Road', 'Tofa Road'],
  'Minjibir': ['Minjibir Road', 'Wudil Road', 'Tofa Road', 'Gaya Road', 'Dambatta Road'],
  'Nassarawa (Kano)': ['Nassarawa Road', 'Yawori Road', 'Kofar Nasarawa', 'Zaria Road', 'Janguza Road'],
  'Rano': ['Rano Road', 'Bunkure Road', 'Kura Road', 'Garun Mallam', 'Kibiya Road'],
  'Rimin Gado': ['Rimin Gado Road', 'Gezawa Road', 'Wudil Road', 'Dunkin Road', 'Gaya Road'],
  'Rogo': ['Rogo Road', 'Karaye Road', 'Bugai Road', 'Gwarzo Road', 'Kunchi Road'],
  'Sabon Gari': ['Sabon Gari Road', 'Ahmadu Bello Way', 'Abubakar Tatari Ali', 'Mission Road', 'France Road'],
  'Sandiramu': ['Sandiramu Road', 'Zaria Road', 'Katsina Road', 'Jibia Road', 'Daura Road'],
  'Sumaila': ['Sumaila Road', 'Takai Road', 'Tarauni Road', 'Gaya Road', 'Albasu Road'],
  'Takai': ['Takai Road', 'Sumaila Road', 'Gaya Road', 'Kunchi Road', 'Dala Road'],
  'Tarauni': ['Tarauni Road', 'Zaria Road', 'Kofar Kudu', 'Katsina Road', 'Daura Road'],
  'Tofa': ['Tofa Road', 'Wudil Road', 'Dambatta Road', 'Minjibir Road', 'Gaya Road'],
  'Tsanyawa': ['Tsanyawa Road', 'Gaya Road', 'Tofa Road', 'Dambatta Road', 'Kabo Road'],
  'Tudun Wada': ['Tudun Wada Road', 'Doguwa Road', 'Sumaila Road', 'Lame Road', 'Kwalli Road'],
  'Ungogo': ['Ungogo Road', 'Dawakin Tofa', 'Madobi Road', 'Kano Road', 'Zaria Road'],
  'Warawa': ['Warawa Road', 'Wudil Road', 'Gezawa Road', 'Gabasawa Road', 'Minjibir Road'],
  'Wudil': ['Wudil Road', 'Tofa Road', 'Gaya Road', 'Sumaila Road', 'Dambatta Road'],

  // Rivers Streets
  'Port Harcourt': ['Azikiwe Road', 'Aba Road', 'Garrison Road', 'Forces Avenue', 'Rumuola Road', 'Trans Amadi Road', 'Ikwerre Road'],
  'Obio-Akpor': ['Rumuokwuta Road', 'Rumuola Road', 'Rumuepirikom Road', 'Rumuomasi Road', 'Elelenwo Road'],
  'Okrika': ['Okrika Road', 'Amadioma Road', 'Igbokuche Road', 'George Road', 'Kalio Street'],
  'Oyigbo': ['Oyigbo Road', 'Eleme Road', 'Afam Road', 'Imo River Road', 'Ukam Road'],
  'Eleme': ['Eleme Road', 'Akpajo Road', 'Ogbele Road', 'Onne Road', 'Ibeto Road'],
  'Tai': ['Bori Road', 'Kpor Road', 'Nonwa Road', 'Ban-Ogoi Road', 'Yeghe Road'],
  'Gokana': ['Bori Road', 'Kpor Road', 'B-Dere Road', 'K Dere Road', 'Sakpenwa Road'],
  'Khana': ['Bori Road', 'Kono-Boue Road', 'Baan Road', 'Kpean Road', 'Kpaghua Road'],
  'Andoni': ['Ngo Road', 'Ikuru Road', 'Okorobo Road', 'Unyeada Road', 'Ele Road'],
  'Bonny': ['Finima Road', 'Adonye Road', 'Sandal Road', 'Banana Road', 'Lighthouse Road'],
  'Degema': ['Degema Road', 'Abonnema Road', 'Bakana Road', 'Obuama Road', 'Kula Road'],
  'Asari-Toru': ['Abonnema Road', 'Buguma Road', 'Kula Road', 'Degema Road', 'Tombia Road'],
  'Akuku-Toru': ['Abonnema Road', 'Kula Road', 'Buguma Road', 'Kema Road', 'Obuama Road'],
  'Abua-Odual': ['Abua Road', 'Ahoada Road', 'Ogbia Road', 'Emago Road', 'Odiereku Road'],
  'Ahoada East': ['Ahoada Road', 'Ogba Road', 'Erema Road', 'Omoku Road', 'Egbema Road'],
  'Ahoada West': ['Ahoada Road', 'Ogba Road', 'Ekpeye Road', 'Ubeta Road', 'Okarki Road'],
  'Ogba-Egbema-Ndoni': ['Ogba Road', 'Omoku Road', 'Egbema Road', 'Ndoni Road', 'Obrikom Road'],
  'Emuoha': ['Emuoha Road', 'Rumuji Road', 'Ibaa Road', 'Omerelu Road', 'Ovioro Road'],
  'Ikwerre': ['Igwuruta Road', 'Isiokpo Road', 'Aluu Road', 'Rumuji Road', 'Emuoha Road'],
  'Etche': ['Okehi Road', 'Igwurita Road', 'Chokocho Road', 'Umuakali Road', 'Umuoye Road'],

  // Kaduna Streets
  'Kaduna North': ['Ahmadu Bello Way', 'Gimbiya Street', 'Isa Kaita Road', 'Sokoto Road', 'Lugard Hall'],
  'Kaduna South': ['Kachia Road', 'Kakuri Road', 'Mando Road', 'Ungwan Rimi', 'Television Road'],
  'Zaria': ['Samaru Road', 'Kofar Goya', 'Zaria Road', 'Katsina Road', 'Hadejia Road'],
  'Zangon Kataf': ['Zangon Kataf Road', 'Kagoro Road', 'Kafanchan Road', 'Moro Road', 'Toungo Road'],
  'Sabon Gari (Kaduna)': ['Ribadu Road', 'Gaskiya Road', 'Barde Road', 'Katsina Road', 'Ahmadu Bello Way'],
  'Kaura': ['Kaura Road', 'Kagoro Road', 'Zangon Kataf Road', 'Kafanchan Road', 'Moro Road'],
  'Kauru': ['Kauru Road', 'Kafanchan Road', 'Lere Road', 'Kagoro Road', 'Zangon Kataf Road'],
  'Kagarko': ['Kagarko Road', 'Keffi Road', 'Kaduna Road', 'Abuja Road', 'Kuje Road'],
  'Kachia': ['Kachia Road', 'Kagoro Road', 'Kaura Road', 'Zangon Kataf Road', 'Kafanchan Road'],
  'Kajuru': ['Kajuru Road', 'Kachia Road', 'Kagoro Road', 'Kaduna Road', 'Kafanchan Road'],
  'Chikun': ['Chikun Road', 'Kaduna Road', 'Airport Road', 'Mando Road', 'Ungwan Rimi'],
  'Giwa': ['Giwa Road', 'Kudan Road', 'Ikara Road', 'Lere Road', 'Zaria Road'],
  'Igabi': ['Igabi Road', 'Kaduna Road', 'Zaria Road', 'Kawo Road', 'Mando Road'],
  'Ikara': ['Ikara Road', 'Giwa Road', 'Kudan Road', 'Lere Road', 'Zaria Road'],
  'Jaba': ['Jaba Road', 'Kagoro Road', 'Kachia Road', 'Kaura Road', 'Zangon Kataf Road'],
  "Jema'a": ['Kafanchan Road', "Jema'a Road", 'Kagoro Road', 'Zangon Kataf Road', 'Kaura Road'],
  'Kufana': ['Kafanchan Road', "Jema'a Road", 'Kagoro Road', 'Zangon Kataf Road', 'Moro Road'],
  'Lere': ['Lere Road', 'Kauru Road', 'Kagarko Road', 'Ikara Road', 'Giwa Road'],
  'Makarfi': ['Makarfi Road', 'Zaria Road', 'Ikara Road', 'Giwa Road', 'Kudan Road'],
  'Sanga': ['Sanga Road', 'Kafanchan Road', "Jema'a Road", 'Kagoro Road', 'Zangon Kataf Road'],
  'Tudun Wada (Kaduna)': ['Tudun Wada Road', 'Zaria Road', 'Kaura Road', 'Kagoro Road', 'Kafanchan Road'],
  'Birnin Gwari': ['Birnin Gwari Road', 'Kaduna Road', 'Minna Road', 'Funtua Road', 'Kuyello Road'],

  // Edo Streets
  'Oredo': ['Airport Road', 'Akpakpava Street', 'Benin-Auchi Road', 'Ekewan Road', 'Sapele Road', 'Ugbowo Road', 'Ikpoba Slope'],
  'Ikpoba-Okha': ['Ikpoba Road', 'Benin-Agbor Road', 'Sapele Road', 'Aduwawa Road', 'Iguodala Road'],
  'Egor': ['Benin-Auchi Road', 'Ekpoma Road', 'Ugbowo Road', 'Ishara Road', 'Ogba Road'],
  'Uhunmwonde': ['Benin-Auchi Road', 'Igua Road', 'Ekiadolor Road', 'Evbotubu Road', 'Oba Market Road'],
  'Ovia North-East': ['Benin-Auchi Road', 'Ovia Road', 'Iguovbioba Road', 'Okada Road', 'Usen Road'],
  'Ovia South-West': ['Benin-Sapele Road', 'Ovia Road', 'Igieduma Road', 'Ugu Road', 'Iguobazuwa Road'],
  'Orhionmwon': ['Benin-Agbor Road', 'Iguobazuwa Road', 'Ugoneki Road', 'Abudu Road', 'Igbanke Road'],
  'Esan Central': ['Irrua Road', 'Ekpoma Road', 'Uromi Road', 'Ugboha Road', 'Ewohimi Road'],
  'Esan North-East': ['Uromi Road', 'Ubiaja Road', 'Ewu Road', 'Ekpoma Road', 'Irrua Road'],
  'Esan South-East': ['Ubiaja Road', 'Igueben Road', 'Ekpoma Road', 'Ugboha Road', 'Ohordua Road'],
  'Esan West': ['Ekpoma Road', 'Irrua Road', 'Uromi Road', 'Ubiaja Road', 'Ewu Road'],
  'Etsako Central': ['Auchi Road', 'Ibillo Road', 'Ososo Road', 'Agenebode Road', 'Okene Road'],
  'Etsako East': ['Agenebode Road', 'Auchi Road', 'Okene Road', 'Ibillo Road', 'Ososo Road'],
  'Etsako West': ['Auchi Road', 'Okene Road', 'Jattu Road', 'Iyamo Road', 'South Ibie Road'],
  'Igueben': ['Igueben Road', 'Ekpoma Road', 'Ubiaja Road', 'Uromi Road', 'Ewu Road'],
  'Ovia': ['Ovia Road', 'Benin-Sapele Road', 'Iguovbioba Road', 'Okada Road', 'Usen Road'],
  'Owan East': ['Afuze Road', 'Auchi Road', 'Okene Road', 'Ibillo Road', 'Ososo Road'],
  'Owan West': ['Sabongida-Ora Road', 'Auchi Road', 'Okene Road', 'Uzebba Road', 'Ibillo Road'],

  // Ogun Streets
  'Abeokuta North': ['Lafenwa Road', 'Abeokuta Road', 'Oke-Mosan', 'Kemta Road', 'Ibara Road'],
  'Abeokuta South': ['Abeokuta Road', 'Ibara Road', 'Kuto Road', 'Isale-Igbein Road', 'Moshood Abiola Way'],
  'Ado-Odo/Ota': ['Ota-Abeokuta Road', 'Idi-Iroko Road', 'Lusada Road', 'Atan Road', 'Igbesa Road'],
  'Ewekoro': ['Abeokuta Road', 'Lagos Road', 'Papalanto Road', 'Wasinmi Road', 'Itori Road'],
  'Ifo': ['Abeokuta Road', 'Lagos Road', 'Ifo Road', 'Itori Road', 'Papalanto Road'],
  'Ijebu East': ['Ijebu Ode Road', 'Itele Road', 'Obe Road', 'Odogbolu Road', 'Igbogbo Road'],
  'Ijebu North': ['Ijebu Ode Road', 'Awa Road', 'Ibadan Road', 'Oru Road', 'Imowo Road'],
  'Ijebu North-East': ['Ijebu Ode Road', 'Awa Road', 'Oru Road', 'Itele Road', 'Igbogbo Road'],
  'Ijebu Ode': ['Ijebu Ode Road', 'Fidipote Road', 'Ibadan Road', 'Molipa Road', 'Erunwon Road'],
  'Ikenne': ['Ikenne Road', 'Ilisho Road', 'Iperu Road', 'Shagamu Road', 'Sagamu-Ikorodu Road'],
  'Imeko-Afon': ['Imeko Road', 'Ilara Road', 'Abeokuta Road', 'Ketu Road', 'Ifoyintedo Road'],
  'Ipokia': ['Idi-Iroko Road', 'Ipokia Road', 'Ilaro Road', 'Abeokuta Road', 'Ota Road'],
  'Obafemi-Owode': ['Abeokuta Road', 'Lagos Road', 'Mowe Road', 'Ofada Road', 'Kobape Road'],
  'Odeda': ['Abeokuta Road', 'Ibadan Road', 'Odeda Road', 'Olodo Road', 'Ogere Road'],
  'Odogbolu': ['Ijebu Ode Road', 'Odogbolu Road', 'Ikenne Road', 'Ilisho Road', 'Awa Road'],
  'Ogun Waterside': ['Abigi Road', 'Iwopin Road', 'Efire Road', 'Lukogbe Road', 'Ayede Road'],
  'Remo North': ['Ikenne Road', 'Ilisho Road', 'Iperu Road', 'Shagamu Road', 'Ogere Road'],
  'Sagamu': ['Sagamu Road', 'Ikorodu Road', 'Benin Road', 'Abeokuta Road', 'Ikenne Road'],
  'Yewa North': ['Ayetoro Road', 'Ilaro Road', 'Owode Road', 'Iboro Road', 'Idi-Iroko Road'],
  'Yewa South': ['Ilaro Road', 'Idi-Iroko Road', 'Ajilete Road', 'Owode Road', 'Ifoyintedo Road'],

  // Ondo Streets
  'Akoko North-East': ['Ikare Road', 'Oka Road', 'Owo Road', 'Ipe-Akoko Road', 'Isua Road'],
  'Akoko North-West': ['Oka Road', 'Ikare Road', 'Owo Road', 'Ipe-Akoko Road', 'Auga-Akoko Road'],
  'Akoko South-West': ['Oka Road', 'Akunnu Road', 'Supare Akoko Road', 'Ikare Road', 'Owo Road'],
  'Akoko South-East': ['Ikare Road', 'Oka Road', 'Ipe-Akoko Road', 'Isua Road', 'Owo Road'],
  'Akure North': ['Akure Road', 'Owo Road', 'Idanre Road', 'Ogbagi Road', 'Iju Road'],
  'Akure South': ['Oba Adesida Road', 'Oyemekun Road', 'Ondo Road', 'Ilesha Road', 'Akure Road'],
  'Ese-Odo': ['Igbekebo Road', 'Igbobini Road', 'Arogbo Road', 'Kiribo Road', 'Ojuala Road'],
  'Idanre': ['Idanre Road', 'Owena Road', 'Oke-Ila Road', 'Alade Road', 'Ondo Road'],
  'Ifedore': ['Ijare Road', 'Igbara-Oke Road', 'Ondo Road', 'Akure Road', 'Owena Road'],
  'Igbara-Oke': ['Igbara-Oke Road', 'Ijare Road', 'Owena Road', 'Ondo Road', 'Akure Road'],
  'Ilaje': ['Igbekebo Road', 'Igbobini Road', 'Arogbo Road', 'Erunna Road', 'Mahin Road'],
  'Ile-Oluji/Okeigbo': ['Ile-Oluji Road', 'Okeigbo Road', 'Ondo Road', 'Ore Road', 'Owena Road'],
  'Irele': ['Ore Road', 'Igbekebo Road', 'Igbobini Road', 'Arogbo Road', 'Okitipupa Road'],
  'Odigbo': ['Ore Road', 'Ondo Road', 'Akure Road', 'Ile-Oluji Road', 'Okitipupa Road'],
  'Okitipupa': ['Okitipupa Road', 'Ore Road', 'Igbokoda Road', 'Irele Road', 'Igbekebo Road'],
  'Ondo West': ['Ondo Road', 'Akure Road', 'Ore Road', 'Idanre Road', 'Owena Road'],
  'Ondo East': ['Ondo Road', 'Akure Road', 'Idanre Road', 'Owena Road', 'Oke-Ila Road'],
  'Ose': ['Owo Road', 'Ifon Road', 'Akure Road', 'Ondo Road', 'Uzegba Road'],
  'Owo': ['Owo Road', 'Akure Road', 'Ondo Road', 'Ikare Road', 'Ipe-Akoko Road'],

  // Anambra Streets
  'Anambra East': ['Onitsha Road', 'Otuocha Road', 'Nsugbe Road', 'Umueri Road', 'Aguleri Road'],
  'Anambra West': ['Onitsha Road', 'Otuocha Road', 'Mmiata Road', 'Umuenwelum Road', 'Inoma-Agu Road'],
  'Anaocha': ['Neni Road', 'Agulu Road', 'Njikoka Road', 'Awka Road', 'Oko Road'],
  'Awka North': ['Awka Road', 'Amansea Road', 'Ebenebe Road', 'Ugbene Road', 'Isu-Aniocha Road'],
  'Awka South': ['Awka Road', 'Zik Avenue', 'Arthur Eze Avenue', 'Unizik Junction', 'Amawbia Road'],
  'Dunukofia': ['Awka Road', 'Ukpo Road', 'Umunnachi Road', 'Ukwulu Road', ' Nawgu Road'],
  'Ekwusigo': ['Ozubulu Road', 'Nnewi Road', 'Ichi Road', 'Oraifite Road', 'Ihembosi Road'],
  'Idemili North': ['Oba Road', 'Nkpor Road', 'Ogidi Road', 'Uke Road', 'Otti Road'],
  'Idemili South': ['Nnewi Road', 'Ozubulu Road', 'Ichi Road', 'Oraifite Road', 'Ihembosi Road'],
  'Ihiala': ['Ihiala Road', 'Owerri Road', 'Uli Road', 'Azia Road', 'Mbosi Road'],
  'Njikoka': ['Awka Road', 'Enugu Road', 'Abagana Road', 'Enugwu-Ukwu Road', 'Nimo Road'],
  'Nnewi North': ['Nnewi Road', 'Okigwe Road', 'Ozubulu Road', 'Ichi Road', 'Oraifite Road'],
  'Nnewi South': ['Nnewi Road', 'Ozubulu Road', 'Ihiala Road', 'Azia Road', 'Utu Road'],
  'Ogbaru': ['Onitsha Road', 'Atani Road', 'Ossomala Road', 'Ogbakuba Road', 'Ohita Road'],
  'Onitsha North': ['Oguta Road', 'Awka Road', 'Old Market Road', 'Bishop Crowther Road', 'Modebe Avenue'],
  'Onitsha South': ['Oguta Road', 'Awka Road', 'Main Market Road', 'Upper Iweka', 'Nkisi Road'],
  'Orumba North': ['Awka Road', 'Umunze Road', 'Ajalli Road', 'Nanka Road', 'Oko Road'],
  'Orumba South': ['Umunze Road', 'Awka Road', 'Nanka Road', 'Ekwulobia Road', 'Oko Road'],
  'Oyi': ['Onitsha Road', 'Awka Road', 'Nteje Road', 'Umuleri Road', 'Ogbunike Road'],

  // Imo Streets
  'Aboh Mbaise': ['Aboh Road', 'Mbaise Road', 'Owerri Road', 'Umuahia Road', 'Ngwa Road'],
  'Ahiazu Mbaise': ['Ahiazu Road', 'Mbaise Road', 'Owerri Road', 'Umuahia Road', 'Ngwa Road'],
  'Ehime Mbano': ['Ehime Road', 'Mbano Road', 'Okigwe Road', 'Owerri Road', 'Umuahia Road'],
  'Ezinihitte': ['Ezinihitte Road', 'Mbaise Road', 'Owerri Road', 'Umuahia Road', 'Ngwa Road'],
  'Ideato North': ['Ideato Road', 'Okigwe Road', 'Owerri Road', 'Orlu Road', 'Umuahia Road'],
  'Ideato South': ['Ideato Road', 'Orlu Road', 'Owerri Road', 'Okigwe Road', 'Umuahia Road'],
  'Ihitte/Uboma': ['Ihitte Road', 'Uboma Road', 'Owerri Road', 'Okigwe Road', 'Umuahia Road'],
  'Ikeduru': ['Ikeduru Road', 'Owerri Road', 'Okigwe Road', 'Mbaise Road', 'Umuahia Road'],
  'Isiala Mbano': ['Isiala Road', 'Mbano Road', 'Okigwe Road', 'Owerri Road', 'Umuahia Road'],
  'Isu': ['Isu Road', 'Orlu Road', 'Owerri Road', 'Okigwe Road', 'Mbaise Road'],
  'Mbaitoli': ['Mbaitoli Road', 'Owerri Road', 'Orlu Road', 'Okigwe Road', 'Umuahia Road'],
  'Ngor-Okpala': ['Ngor Road', 'Okpala Road', 'Owerri Road', 'Port Harcourt Road', 'Umuahia Road'],
  'Njaba': ['Njaba Road', 'Owerri Road', 'Orlu Road', 'Mbaise Road', 'Umuahia Road'],
  'Nkwerre': ['Nkwerre Road', 'Orlu Road', 'Owerri Road', 'Okigwe Road', 'Mbaise Road'],
  'Nwangele': ['Nwangele Road', 'Orlu Road', 'Owerri Road', 'Okigwe Road', 'Umuahia Road'],
  'Obowo': ['Obowo Road', 'Owerri Road', 'Okigwe Road', 'Umuahia Road', 'Mbaise Road'],
  'Oguta': ['Oguta Road', 'Owerri Road', 'Orlu Road', 'Mbiama Road', 'Port Harcourt Road'],
  'Ohaji/Egbema': ['Ohaji Road', 'Egbema Road', 'Owerri Road', 'Port Harcourt Road', 'Umuahia Road'],
  'Okigwe': ['Okigwe Road', 'Owerri Road', 'Umuahia Road', 'Orlu Road', 'Mbaise Road'],
  'Orlu': ['Orlu Road', 'Owerri Road', 'Okigwe Road', 'Mbaise Road', 'Umuahia Road'],
  'Orsu': ['Orsu Road', 'Orlu Road', 'Owerri Road', 'Okigwe Road', 'Mbaise Road'],
  'Oru East': ['Orlu Road', 'Oru Road', 'Owerri Road', 'Okigwe Road', 'Umuahia Road'],
  'Oru West': ['Oru Road', 'Orlu Road', 'Owerri Road', 'Okigwe Road', 'Umuahia Road'],
  'Owerri Municipal': ['Wetheral Road', 'Douglas Road', 'Royce Road', 'Ikenegbu Road', 'Tetlow Road'],
  'Owerri North': ['Orlu Road', 'Owerri Road', 'Okigwe Road', 'Mbaise Road', 'Umuahia Road'],
  'Owerri West': ['Orlu Road', 'Owerri Road', 'Mbaise Road', 'Umuahia Road', 'Port Harcourt Road'],

  // Enugu Streets
  'Aninri': ['Enugu Road', 'Awgu Road', 'Nkalagu Road', 'Mpu Road', 'Oduma Road'],
  'Awgu': ['Enugu Road', 'Awgu Road', 'Owerri Road', 'Umuahia Road', 'Okigwe Road'],
  'Enugu East': ['Enugu Road', 'Abakaliki Road', 'Awgu Road', 'Ogui Road', 'Presidential Road'],
  'Enugu North': ['Enugu Road', 'Ogui Road', 'Abakaliki Road', 'Awgu Road', 'Chime Avenue'],
  'Enugu South': ['Enugu Road', 'Awgu Road', 'Opi Road', 'Nsukka Road', 'Abakaliki Road'],
  'Ezeagu': ['Enugu Road', 'Awgu Road', 'Udi Road', 'Oji River Road', 'Agbani Road'],
  'Igbo-Eze North': ['Nsukka Road', 'Enugu Road', 'Obollo-Afor Road', 'Opi Road', 'Ibagwa Road'],
  'Igbo-Eze South': ['Nsukka Road', 'Enugu Road', 'Opi Road', 'Obollo-Afor Road', 'Ibagwa Road'],
  'Isi-Uzo': ['Enugu Road', 'Nsukka Road', 'Opi Road', 'Nkalagu Road', 'Ikem Road'],
  'Nkanu East': ['Enugu Road', 'Awgu Road', 'Agbani Road', 'Opi Road', 'Abakaliki Road'],
  'Nkanu West': ['Enugu Road', 'Awgu Road', 'Agbani Road', 'Opi Road', 'Abakaliki Road'],
  'Nsukka': ['Nsukka Road', 'Enugu Road', 'Opi Road', 'Obollo-Afor Road', 'Ibagwa Road'],
  'Oji River': ['Enugu Road', 'Awgu Road', 'Udi Road', 'Agbani Road', 'Ezeagu Road'],
  'Udenu': ['Enugu Road', 'Nsukka Road', 'Obollo-Afor Road', 'Opi Road', 'Ibagwa Road'],
  'Udi': ['Enugu Road', 'Awgu Road', 'Oji River Road', 'Agbani Road', 'Ezeagu Road'],
  'Uzo-Uwani': ['Enugu Road', 'Nsukka Road', 'Nkalagu Road', 'Opi Road', 'Obollo-Afor Road'],

  // Abia Streets
  'Aba North': ['Aba Road', 'Factory Road', 'Azikiwe Road', 'Uratta Road', 'Owerri Road'],
  'Aba South': ['Aba Road', 'Faulks Road', 'St. Michael Road', 'Georgetown Road', 'Ngwa Road'],
  'Arochukwu': ['Arochukwu Road', 'Ndi Okwu Road', 'Ibiakpan Road', 'Asaga Road', 'Ndibe Road'],
  'Bende': ['Bende Road', 'Umuahia Road', 'Igbere Road', 'Alayi Road', 'Item Road'],
  'Umuahia North': ['Umuahia Road', 'Aba Road', 'Owerri Road', 'Ikot Ekpene Road', 'Bank Road'],
  'Umuahia South': ['Umuahia Road', 'Aba Road', 'Olokoro Road', 'Ubakala Road', 'Ariam Road'],

  // Adamawa Streets
  'Yola North': ['Yola Road', 'Mubi Road', 'Numan Road', 'Jimeta Road', 'Gongola Road'],
  'Yola South': ['Yola Road', 'Mubi Road', 'Numan Road', 'Jimeta Road', 'Girei Road'],
  'Mubi North': ['Mubi Road', 'Yola Road', 'Michika Road', 'Madagali Road', 'Hong Road'],
  'Mubi South': ['Mubi Road', 'Yola Road', 'Michika Road', 'Uba Road', 'Mayo Belwa Road'],
  'Numan': ['Numan Road', 'Yola Road', 'Jimeta Road', 'Lau Road', 'Demsa Road'],

  // Akwa Ibom Streets
  'Uyo': ['Uyo Road', 'Aba Road', 'Ikot Ekpene Road', 'Eket Road', 'Oron Road'],
  'Eket': ['Eket Road', 'Uyo Road', 'Ibeno Road', 'Esit Eket Road', 'Onna Road'],
  'Ikot Ekpene': ['Ikot Ekpene Road', 'Uyo Road', 'Aba Road', 'Ukanafun Road', 'Obot Akara Road'],
  'Oron': ['Oron Road', 'Uyo Road', 'Eket Road', 'Mbo Road', 'Udung Uko Road'],
  'Itu': ['Itu Road', 'Uyo Road', 'Ikot Ekpene Road', 'Ibiono Road', 'Aba Road'],

  // Bauchi Streets
  'Bauchi': ['Bauchi Road', 'Kano Road', 'Jos Road', 'Gombe Road', 'Jama\'are Road'],
  'Giade': ['Giade Road', 'Bauchi Road', 'Kano Road', 'Azare Road', 'Misau Road'],
  'Misau': ['Misau Road', 'Bauchi Road', 'Kano Road', 'Azare Road', 'Darazo Road'],
  'Azare': ['Azare Road', 'Kano Road', 'Bauchi Road', 'Potiskum Road', 'Katagum Road'],
  'Jama\'are': ['Jama\'are Road', 'Bauchi Road', 'Azare Road', 'Kano Road', 'Misau Road'],

  // Bayelsa Streets
  'Yenagoa': ['Yenagoa Road', 'Mbiama Road', 'East-West Road', 'Sagbama Road', 'Ogbia Road'],
  'Brass': ['Brass Road', 'Yenagoa Road', 'Nembe Road', 'Ogbia Road', 'Southern Ijaw Road'],
  'Nembe': ['Nembe Road', 'Yenagoa Road', 'Brass Road', 'Ogbia Road', 'Southern Ijaw Road'],
  'Ogbia': ['Ogbia Road', 'Yenagoa Road', 'Mbiama Road', 'East-West Road', 'Sagbama Road'],
  'Sagbama': ['Sagbama Road', 'Yenagoa Road', 'Mbiama Road', 'East-West Road', 'Southern Ijaw Road'],

  // Benue Streets
  'Makurdi': ['Makurdi Road', 'Gboko Road', 'Otukpo Road', 'Nigeria Road', 'Keffi Road'],
  'Gboko': ['Gboko Road', 'Makurdi Road', 'Katsina-Ala Road', 'Zaki Biam Road', 'Ushongo Road'],
  'Otukpo': ['Otukpo Road', 'Makurdi Road', 'Gboko Road', 'Ugbokpo Road', 'Adoka Road'],
  'Katsina-Ala': ['Katsina-Ala Road', 'Gboko Road', 'Makurdi Road', 'Zaki Biam Road', 'Ushongo Road'],
  'Zaki Biam': ['Zaki Biam Road', 'Katsina-Ala Road', 'Gboko Road', 'Makurdi Road', 'Wukari Road'],

  // Borno Streets
  'Maiduguri': ['Maiduguri Road', 'Damboa Road', 'Biou Road', 'Kano Road', 'Dikwa Road'],
  'Monguno': ['Monguno Road', 'Maiduguri Road', 'Kukawa Road', 'Gubio Road', 'Bama Road'],
  'Bama': ['Bama Road', 'Maiduguri Road', 'Gwoza Road', 'Dikwa Road', 'Kala/Balge Road'],
  'Dikwa': ['Dikwa Road', 'Maiduguri Road', 'Bama Road', 'Monguno Road', 'Kukawa Road'],
  'Gwoza': ['Gwoza Road', 'Maiduguri Road', 'Bama Road', 'Damboa Road', 'Askira/Uba Road'],

  // Cross River Streets
  'Calabar Municipal': ['Calabar Road', 'Aba Road', 'Ikot Ekpene Road', 'Maryland Road', 'Murtala Muhammed Highway'],
  'Calabar South': ['Calabar Road', 'Aba Road', 'Ikot Ekpene Road', 'Maryland Road', 'Murtala Muhammed Highway'],
  'Ikom': ['Ikom Road', 'Calabar Road', 'Ogoja Road', 'Obubra Road', 'Obudu Road'],
  'Ogoja': ['Ogoja Road', 'Ikom Road', 'Calabar Road', 'Obudu Road', 'Yala Road'],
  'Obudu': ['Obudu Road', 'Ogoja Road', 'Ikom Road', 'Calabar Road', 'Obubra Road'],

  // Delta Streets
  'Warri South': ['Warri Road', 'Effurun Road', 'Udu Road', 'Sapele Road', 'Uvwie Road'],
  'Warri North': ['Warri Road', 'Koko Road', 'Sapele Road', 'Burutu Road', 'Patani Road'],
  'Uvwie': ['Uvwie Road', 'Effurun Road', 'Warri Road', 'Udu Road', 'Sapele Road'],
  'Sapele': ['Sapele Road', 'Warri Road', 'Benin Road', 'Udu Road', 'Uvwie Road'],
  'Asaba': ['Asaba Road', 'Benin Road', 'Onitsha Road', 'Ibusa Road', 'Ogwashi-Uku Road'],

  // Ebonyi Streets
  'Abakaliki': ['Abakaliki Road', 'Enugu Road', 'Afikpo Road', 'Ogoja Road', 'Makurdi Road'],
  'Afikpo North': ['Afikpo Road', 'Abakaliki Road', 'Enugu Road', 'Ogoja Road', 'Makurdi Road'],
  'Ezza North': ['Ezza Road', 'Abakaliki Road', 'Enugu Road', 'Afikpo Road', 'Ishielu Road'],
  'Ikwo': ['Ikwo Road', 'Abakaliki Road', 'Enugu Road', 'Ezza Road', 'Ishielu Road'],
  'Ohaozara': ['Ohaozara Road', 'Afikpo Road', 'Abakaliki Road', 'Enugu Road', 'Ishielu Road'],

  // Ekiti Streets
  'Ado Ekiti': ['Ado Ekiti Road', 'Akure Road', 'Ilesha Road', 'Ibadan Road', 'Ikere Road'],
  'Ikere': ['Ikere Road', 'Ado Ekiti Road', 'Akure Road', 'Ilesha Road', 'Ibadan Road'],
  'Ijero': ['Ijero Road', 'Ado Ekiti Road', 'Akure Road', 'Ilesha Road', 'Ibadan Road'],
  'Efon': ['Efon Road', 'Ado Ekiti Road', 'Ilesha Road', 'Akure Road', 'Ibadan Road'],
  'Oye': ['Oye Road', 'Ado Ekiti Road', 'Ikole Road', 'Ibadan Road', 'Akure Road'],

  // Gombe Streets
  'Gombe': ['Gombe Road', 'Bauchi Road', 'Yola Road', 'Jos Road', 'Kano Road'],
  'Kaltungo': ['Kaltungo Road', 'Gombe Road', 'Bauchi Road', 'Yola Road', 'Jos Road'],
  'Dukku': ['Dukku Road', 'Gombe Road', 'Bauchi Road', 'Kano Road', 'Funakaye Road'],
  'Billiri': ['Billiri Road', 'Gombe Road', 'Bauchi Road', 'Kaltungo Road', 'Yola Road'],
  'Akko': ['Akko Road', 'Gombe Road', 'Bauchi Road', 'Kano Road', 'Dukku Road'],

  // Jigawa Streets
  'Dutse': ['Dutse Road', 'Kano Road', 'Kazaure Road', 'Birnin Kudu Road', 'Hadejia Road'],
  'Hadejia': ['Hadejia Road', 'Dutse Road', 'Kano Road', 'Kazaure Road', 'Ringim Road'],
  'Kazaure': ['Kazaure Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Ringim': ['Ringim Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Kazaure Road'],
  'Gumel': ['Gumel Road', 'Dutse Road', 'Kano Road', 'Kazaure Road', 'Hadejia Road'],

  // Katsina Streets
  'Katsina': ['Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road', 'Jibia Road'],
  'Daura': ['Daura Road', 'Katsina Road', 'Kano Road', 'Jibia Road', 'Mai\'Adua Road'],
  'Funtua': ['Funtua Road', 'Katsina Road', 'Kano Road', 'Kaduna Road', 'Malumfashi Road'],
  'Malumfashi': ['Malumfashi Road', 'Katsina Road', 'Funtua Road', 'Kano Road', 'Daura Road'],
  'Jibia': ['Jibia Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Mai\'Adua Road'],

  // Kebbi Streets
  'Birnin Kebbi': ['Birnin Kebbi Road', 'Kano Road', 'Sokoto Road', 'Zuru Road', 'Argungu Road'],
  'Argungu': ['Argungu Road', 'Birnin Kebbi Road', 'Kano Road', 'Sokoto Road', 'Zuru Road'],
  'Yauri': ['Yauri Road', 'Birnin Kebbi Road', 'Kontagora Road', 'Zuru Road', 'Sokoto Road'],
  'Zuru': ['Zuru Road', 'Birnin Kebbi Road', 'Yauri Road', 'Kontagora Road', 'Sokoto Road'],
  'Jega': ['Jega Road', 'Birnin Kebbi Road', 'Kano Road', 'Sokoto Road', 'Argungu Road'],

  // Kogi Streets
  'Lokoja': ['Lokoja Road', 'Abuja Road', 'Okene Road', 'Ajaokuta Road', 'Kabba Road'],
  'Okene': ['Okene Road', 'Lokoja Road', 'Kabba Road', 'Ajaokuta Road', 'Obajana Road'],
  'Kabba/Bunu': ['Kabba Road', 'Lokoja Road', 'Okene Road', 'Obajana Road', 'Ajaokuta Road'],
  'Ajaokuta': ['Ajaokuta Road', 'Lokoja Road', 'Okene Road', 'Kabba Road', 'Obajana Road'],
  'Idah': ['Idah Road', 'Lokoja Road', 'Ankpa Road', 'Dekina Road', 'Olamaboro Road'],

  // Kwara Streets
  'Ilorin West': ['Ilorin Road', 'Kwara Road', 'Offa Road', 'Jebba Road', 'Oshogbo Road'],
  'Ilorin East': ['Ilorin Road', 'Kwara Road', 'Offa Road', 'Jebba Road', 'Oshogbo Road'],
  'Offa': ['Offa Road', 'Ilorin Road', 'Kwara Road', 'Erin-Ile Road', 'Oshogbo Road'],
  'Oyun': ['Oyun Road', 'Ilorin Road', 'Offa Road', 'Kwara Road', 'Jebba Road'],
  'Kaiama': ['Kaiama Road', 'Ilorin Road', 'Kwara Road', 'Jebba Road', 'Baruten Road'],

  // Nassarawa Streets
  'Lafia': ['Lafia Road', 'Akwanga Road', 'Keffi Road', 'Markurdi Road', 'Jos Road'],
  'Keffi': ['Keffi Road', 'Lafia Road', 'Akwanga Road', 'Abuja Road', 'Markurdi Road'],
  'Akwanga': ['Akwanga Road', 'Lafia Road', 'Keffi Road', 'Jos Road', 'Markurdi Road'],
  'Wamba': ['Wamba Road', 'Lafia Road', 'Akwanga Road', 'Keffi Road', 'Jos Road'],
  'Nassarawa': ['Nassarawa Road', 'Lafia Road', 'Keffi Road', 'Akwanga Road', 'Jos Road'],

  // Niger Streets
  'Minna': ['Minna Road', 'Kaduna Road', 'Suleja Road', 'Bida Road', 'Kontagora Road'],
  'Bida': ['Bida Road', 'Minna Road', 'Kaduna Road', 'Suleja Road', 'Kontagora Road'],
  'Suleja': ['Suleja Road', 'Minna Road', 'Abuja Road', 'Kaduna Road', 'Bida Road'],
  'Kontagora': ['Kontagora Road', 'Minna Road', 'Bida Road', 'Kaduna Road', 'Suleja Road'],
  'Chanchaga': ['Chanchaga Road', 'Minna Road', 'Bida Road', 'Suleja Road', 'Kaduna Road'],

  // Osun Streets
  'Osogbo': ['Osogbo Road', 'Ibadan Road', 'Ilesha Road', 'Abeokuta Road', 'Iwo Road'],
  'Ilesha': ['Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road', 'Akure Road'],
  'Iwo': ['Iwo Road', 'Osogbo Road', 'Ibadan Road', 'Abeokuta Road', 'Ife Road'],
  'Ede': ['Ede Road', 'Osogbo Road', 'Ibadan Road', 'Iwo Road', 'Ife Road'],

  // Oyo Streets
  'Ibadan North': ['Ibadan Road', 'Lagos Road', 'Iwo Road', 'Ife Road', 'Oyo Road'],
  'Ibadan North-East': ['Ibadan Road', 'Lagos Road', 'Iwo Road', 'Ife Road', 'Oyo Road'],
  'Ibadan North-West': ['Ibadan Road', 'Lagos Road', 'Iwo Road', 'Ife Road', 'Oyo Road'],
  'Ibadan South-East': ['Ibadan Road', 'Lagos Road', 'Iwo Road', 'Ife Road', 'Oyo Road'],
  'Ibadan South-West': ['Ibadan Road', 'Lagos Road', 'Iwo Road', 'Ife Road', 'Oyo Road'],
  'Oyo East': ['Oyo Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road', 'Ife Road'],
  'Oyo West': ['Oyo Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road', 'Ife Road'],
  'Ogbomosho North': ['Ogbomosho Road', 'Ibadan Road', 'Lagos Road', 'Oyo Road', 'Iwo Road'],
  'Ogbomosho South': ['Ogbomosho Road', 'Ibadan Road', 'Lagos Road', 'Oyo Road', 'Iwo Road'],

  // Plateau Streets
  'Jos North': ['Jos Road', 'Bauchi Road', 'Murtala Muhammed Road', 'Zaria Road', 'Pankshin Road'],
  'Jos South': ['Jos Road', 'Bauchi Road', 'Murtala Muhammed Road', 'Zaria Road', 'Pankshin Road'],
  'Barkin Ladi': ['Barkin Ladi Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Pankshin': ['Pankshin Road', 'Jos Road', 'Barkin Ladi Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Langtang North': ['Langtang Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Shendam Road'],

  // Sokoto Streets
  'Sokoto North': ['Sokoto Road', 'Kano Road', 'Kebbi Road', 'Zamfara Road', 'Gusau Road'],
  'Sokoto South': ['Sokoto Road', 'Kano Road', 'Kebbi Road', 'Zamfara Road', 'Gusau Road'],
  'Wurno': ['Wurno Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Zamfara Road'],
  'Tambuwal': ['Tambuwal Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Zamfara Road'],

  // Taraba Streets
  'Jalingo': ['Jalingo Road', 'Yola Road', 'Gembu Road', 'Wukari Road', 'Lau Road'],
  'Wukari': ['Wukari Road', 'Jalingo Road', 'Yola Road', 'Takum Road', 'Lau Road'],
  'Takum': ['Takum Road', 'Jalingo Road', 'Wukari Road', 'Yola Road', 'Lau Road'],
  'Lau': ['Lau Road', 'Jalingo Road', 'Wukari Road', 'Yola Road', 'Takum Road'],
  'Gashaka': ['Gashaka Road', 'Jalingo Road', 'Gembu Road', 'Sardauna Road', 'Yola Road'],

  // Yobe Streets
  'Damaturu': ['Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road', 'Geidam Road'],
  'Potiskum': ['Potiskum Road', 'Damaturu Road', 'Maiduguri Road', 'Gashua Road', 'Geidam Road'],
  'Gashua': ['Gashua Road', 'Damaturu Road', 'Potiskum Road', 'Maiduguri Road', 'Geidam Road'],
  'Geidam': ['Geidam Road', 'Damaturu Road', 'Potiskum Road', 'Maiduguri Road', 'Gashua Road'],
  'Nguru': ['Nguru Road', 'Damaturu Road', 'Potiskum Road', 'Gashua Road', 'Geidam Road'],

  // Zamfara Streets
  'Gusau': ['Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Zamfara Road'],
  'Kaura Namoda': ['Kaura Namoda Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Zamfara Road'],
  'Tsafe': ['Tsafe Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kaura Namoda Road'],
  'Zurmi': ['Zurmi Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kaura Namoda Road'],
  'Bakura': ['Bakura Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Tsafe Road'],

  // Missing Abia Streets
  'Ikwuano': ['Ikwuano Road', 'Umuahia Road', 'Aba Road', 'Ikot Ekpene Road', 'Isiala Ngwa Road'],
  'Isiala Ngwa North': ['Isiala Ngwa Road', 'Aba Road', 'Umuahia Road', 'Omoba Road', 'Umuikaa Road'],
  'Isiala Ngwa South': ['Isiala Ngwa Road', 'Aba Road', 'Umuahia Road', 'Omoba Road', 'Umuikaa Road'],
  'Isuikwuato': ['Isuikwuato Road', 'Aba Road', 'Umuahia Road', 'Akoli Road', 'Ovim Road'],
  'Nkporo': ['Nkporo Road', 'Ohafia Road', 'Arochukwu Road', 'Umuahia Road', 'Aba Road'],
  'Obi Ngwa': ['Obi Ngwa Road', 'Aba Road', 'Umuahia Road', 'Owerri Road', 'Isiala Ngwa Road'],
  'Ohafia': ['Ohafia Road', 'Arochukwu Road', 'Umuahia Road', 'Aba Road', 'Item Road'],
  'Osisioma': ['Osisioma Road', 'Aba Road', 'Umuahia Road', 'Owerri Road', 'Ngwa Road'],
  'Ugwunagbo': ['Ugwunagbo Road', 'Aba Road', 'Umuahia Road', 'Owerri Road', 'Obi Ngwa Road'],
  'Ukwa East': ['Ukwa Road', 'Aba Road', 'Owerri Road', 'Umuahia Road', 'Ikot Ekpene Road'],
  'Ukwa West': ['Ukwa Road', 'Aba Road', 'Owerri Road', 'Umuahia Road', 'Ikot Ekpene Road'],
  'Umu-Neochi': ['Umu-Neochi Road', 'Umuahia Road', 'Aba Road', 'Isuikwuato Road', 'Ohafia Road'],

  // Missing Adamawa Streets
  'Demsa': ['Demsa Road', 'Yola Road', 'Numan Road', 'Jimeta Road', 'Lamurde Road'],
  'Fufore': ['Fufore Road', 'Yola Road', 'Girei Road', 'Gombi Road', 'Mayo Belwa Road'],
  'Ganye': ['Ganye Road', 'Jalingo Road', 'Yola Road', 'Numan Road', 'Jimeta Road'],
  'Girei': ['Girei Road', 'Yola Road', 'Jimeta Road', 'Fufore Road', 'Demsa Road'],
  'Gombi': ['Gombi Road', 'Yola Road', 'Hong Road', 'Mubi Road', 'Fufore Road'],
  'Guyuk': ['Guyuk Road', 'Yola Road', 'Jimeta Road', 'Numan Road', 'Demsa Road'],
  'Hong': ['Hong Road', 'Gombi Road', 'Mubi Road', 'Yola Road', 'Michika Road'],
  'Jada': ['Jada Road', 'Yola Road', 'Ganye Road', 'Jimeta Road', 'Numan Road'],
  'Lamurde': ['Lamurde Road', 'Numan Road', 'Yola Road', 'Jimeta Road', 'Demsa Road'],
  'Madagali': ['Madagali Road', 'Mubi Road', 'Michika Road', 'Yola Road', 'Gwoza Road'],
  'Maiha': ['Maiha Road', 'Mubi Road', 'Yola Road', 'Jimeta Road', 'Gombi Road'],
  'Mayo-Belwa': ['Mayo Belwa Road', 'Yola Road', 'Jimeta Road', 'Ganye Road', 'Jada Road'],
  'Michika': ['Michika Road', 'Mubi Road', 'Madagali Road', 'Yola Road', 'Gwoza Road'],
  'Shelleng': ['Shelleng Road', 'Numan Road', 'Yola Road', 'Jimeta Road', 'Lamurde Road'],
  'Song': ['Song Road', 'Yola Road', 'Jimeta Road', 'Gombi Road', 'Hong Road'],
  'Toungo': ['Toungo Road', 'Yola Road', 'Jimeta Road', 'Ganye Road', 'Jada Road'],

  // Missing Akwa Ibom Streets
  'Abak': ['Abak Road', 'Uyo Road', 'Ikot Ekpene Road', 'Etinan Road', 'Aba Road'],
  'Eastern Obolo': ['Eastern Obolo Road', 'Eket Road', 'Uyo Road', 'Ibeno Road', 'Patani Road'],
  'Esit Eket': ['Esit Eket Road', 'Eket Road', 'Uyo Road', 'Ibeno Road', 'Onna Road'],
  'Essien Udim': ['Essien Udim Road', 'Uyo Road', 'Ikot Ekpene Road', 'Abak Road', 'Aba Road'],
  'Etim Ekpo': ['Etim Ekpo Road', 'Uyo Road', 'Ikot Ekpene Road', 'Abak Road', 'Aba Road'],
  'Etinan': ['Etinan Road', 'Uyo Road', 'Eket Road', 'Abak Road', 'Ikot Ekpene Road'],
  'Ibeno': ['Ibeno Road', 'Eket Road', 'Uyo Road', 'Esit Eket Road', 'Eastern Obolo Road'],
  'Ibesikpo Asutan': ['Ibesikpo Asutan Road', 'Uyo Road', 'Ikot Ekpene Road', 'Etinan Road', 'Aba Road'],
  'Ika': ['Ika Road', 'Uyo Road', 'Abak Road', 'Ikot Ekpene Road', 'Aba Road'],
  'Ikono': ['Ikono Road', 'Uyo Road', 'Ikot Ekpene Road', 'Abak Road', 'Aba Road'],
  'Ikot Abasi': ['Ikot Abasi Road', 'Uyo Road', 'Eket Road', 'Oron Road', 'Aba Road'],
  'Ini': ['Ini Road', 'Uyo Road', 'Ikot Ekpene Road', 'Obot Akara Road', 'Aba Road'],
  'Mbo': ['Mbo Road', 'Uyo Road', 'Oron Road', 'Udung Uko Road', 'Eket Road'],
  'Mkpat Enin': ['Mkpat Enin Road', 'Uyo Road', 'Eket Road', 'Ikot Abasi Road', 'Aba Road'],
  'Nsit Atai': ['Nsit Atai Road', 'Uyo Road', 'Ikot Ekpene Road', 'Etinan Road', 'Aba Road'],
  'Nsit Ibom': ['Nsit Ibom Road', 'Uyo Road', 'Ikot Ekpene Road', 'Etinan Road', 'Aba Road'],
  'Nsit Ubium': ['Nsit Ubium Road', 'Uyo Road', 'Eket Road', 'Ikot Ekpene Road', 'Aba Road'],
  'Obot Akara': ['Obot Akara Road', 'Uyo Road', 'Ikot Ekpene Road', 'Ini Road', 'Aba Road'],
  'Okobo': ['Okobo Road', 'Uyo Road', 'Eket Road', 'Oron Road', 'Aba Road'],
  'Onna': ['Onna Road', 'Uyo Road', 'Eket Road', 'Ikot Ekpene Road', 'Aba Road'],
  'Oruk Anam': ['Oruk Anam Road', 'Uyo Road', 'Ikot Ekpene Road', 'Abak Road', 'Aba Road'],
  'Udung Uko': ['Udung Uko Road', 'Uyo Road', 'Oron Road', 'Mbo Road', 'Eket Road'],
  'Ukanafun': ['Ukanafun Road', 'Uyo Road', 'Ikot Ekpene Road', 'Obot Akara Road', 'Aba Road'],
  'Uruan': ['Uruan Road', 'Uyo Road', 'Ikot Ekpene Road', 'Eket Road', 'Aba Road'],
  'Urue-Offong/Oruko': ['Urue Offong Road', 'Uyo Road', 'Eket Road', 'Oron Road', 'Mbo Road'],

  // Missing Bauchi Streets
  'Alkaleri': ['Alkaleri Road', 'Bauchi Road', 'Kano Road', 'Gombe Road', 'Darazo Road'],
  'Bogoro': ['Bogoro Road', 'Bauchi Road', 'Kano Road', 'Gombe Road', 'Dass Road'],
  'Damban': ['Damban Road', 'Bauchi Road', 'Kano Road', 'Darazo Road', 'Misau Road'],
  'Darazo': ['Darazo Road', 'Bauchi Road', 'Kano Road', 'Misau Road', 'Damban Road'],
  'Dass': ['Dass Road', 'Bauchi Road', 'Kano Road', 'Gombe Road', 'Bogoro Road'],
  'Gamawa': ['Gamawa Road', 'Bauchi Road', 'Kano Road', 'Azare Road', 'Katagum Road'],
  'Ganjuwa': ['Ganjuwa Road', 'Bauchi Road', 'Kano Road', 'Gombe Road', 'Dass Road'],
  'Itas/Gadau': ['Itas Gadau Road', 'Bauchi Road', 'Kano Road', 'Azare Road', 'Gamawa Road'],
  'Katagum': ['Katagum Road', 'Bauchi Road', 'Kano Road', 'Azare Road', 'Gamawa Road'],
  'Kirfi': ['Kirfi Road', 'Bauchi Road', 'Kano Road', 'Gombe Road', 'Dass Road'],
  'Ningi': ['Ningi Road', 'Bauchi Road', 'Kano Road', 'Darazo Road', 'Damban Road'],
  'Shira': ['Shira Road', 'Bauchi Road', 'Kano Road', 'Gombe Road', 'Dass Road'],
  'Tafawa Balewa': ['Tafawa Balewa Road', 'Bauchi Road', 'Kano Road', 'Gombe Road', 'Dass Road'],
  'Toro': ['Toro Road', 'Bauchi Road', 'Kano Road', 'Gombe Road', 'Dass Road'],
  'Warji': ['Warji Road', 'Bauchi Road', 'Kano Road', 'Gombe Road', 'Dass Road'],
  'Zaki': ['Zaki Road', 'Bauchi Road', 'Kano Road', 'Gamawa Road', 'Katagum Road'],

  // Missing Bayelsa Streets
  'Ekeremor': ['Ekeremor Road', 'Yenagoa Road', 'Mbiama Road', 'East-West Road', 'Sagbama Road'],
  'Kolokuma/Opokuma': ['Kolokuma Opokuma Road', 'Yenagoa Road', 'Mbiama Road', 'East-West Road', 'Sagbama Road'],
  'Southern Ijaw': ['Southern Ijaw Road', 'Yenagoa Road', 'Mbiama Road', 'East-West Road', 'Brass Road'],

  // Missing Benue Streets
  'Ado': ['Ado Road', 'Makurdi Road', 'Gboko Road', 'Otukpo Road', 'Katsina-Ala Road'],
  'Agatu': ['Agatu Road', 'Makurdi Road', 'Otukpo Road', 'Gboko Road', 'Apa Road'],
  'Apa': ['Apa Road', 'Makurdi Road', 'Otukpo Road', 'Agatu Road', 'Gboko Road'],
  'Buruku': ['Buruku Road', 'Makurdi Road', 'Gboko Road', 'Katsina-Ala Road', 'Otukpo Road'],
  'Guma': ['Guma Road', 'Makurdi Road', 'Gboko Road', 'Gwer East Road', 'Gwer West Road'],
  'Gwer East': ['Gwer East Road', 'Makurdi Road', 'Gboko Road', 'Gwer West Road', 'Guma Road'],
  'Gwer West': ['Gwer West Road', 'Makurdi Road', 'Gboko Road', 'Gwer East Road', 'Guma Road'],
  'Konshisha': ['Konshisha Road', 'Makurdi Road', 'Gboko Road', 'Katsina-Ala Road', 'Ushongo Road'],
  'Kwande': ['Kwande Road', 'Makurdi Road', 'Gboko Road', 'Katsina-Ala Road', 'Ushongo Road'],
  'Logo': ['Logo Road', 'Makurdi Road', 'Gboko Road', 'Katsina-Ala Road', 'Ushongo Road'],
  'Obi': ['Obi Road', 'Makurdi Road', 'Otukpo Road', 'Gboko Road', 'Oju Road'],
  'Ogbadibo': ['Ogbadibo Road', 'Makurdi Road', 'Otukpo Road', 'Gboko Road', 'Oju Road'],
  'Ohimini': ['Ohimini Road', 'Makurdi Road', 'Otukpo Road', 'Gboko Road', 'Oju Road'],
  'Oju': ['Oju Road', 'Makurdi Road', 'Otukpo Road', 'Obi Road', 'Ogbadibo Road'],
  'Okpokwu': ['Okpokwu Road', 'Makurdi Road', 'Otukpo Road', 'Gboko Road', 'Oju Road'],
  'Tarka': ['Tarka Road', 'Makurdi Road', 'Gboko Road', 'Katsina-Ala Road', 'Ushongo Road'],
  'Ukum': ['Ukum Road', 'Makurdi Road', 'Gboko Road', 'Katsina-Ala Road', 'Logo Road'],
  'Ushongo': ['Ushongo Road', 'Makurdi Road', 'Gboko Road', 'Katsina-Ala Road', 'Logo Road'],
  'Vandeikya': ['Vandeikya Road', 'Makurdi Road', 'Gboko Road', 'Otukpo Road', 'Oju Road'],

  // Missing Borno Streets
  'Abadam': ['Abadam Road', 'Maiduguri Road', 'Nguru Road', 'Kukawa Road', 'Monguno Road'],
  'Askira/Uba': ['Askira Uba Road', 'Maiduguri Road', 'Biou Road', 'Chibok Road', 'Damboa Road'],
  'Bayo': ['Bayo Road', 'Maiduguri Road', 'Biou Road', 'Bama Road', 'Gwoza Road'],
  'Biu': ['Biu Road', 'Maiduguri Road', 'Damboa Road', 'Gwoza Road', 'Askira/Uba Road'],
  'Chibok': ['Chibok Road', 'Maiduguri Road', 'Askira/Uba Road', 'Biou Road', 'Damboa Road'],
  'Damboa': ['Damboa Road', 'Maiduguri Road', 'Biou Road', 'Biu Road', 'Gwoza Road'],
  'Gubio': ['Gubio Road', 'Maiduguri Road', 'Monguno Road', 'Kukawa Road', 'Kaga Road'],
  'Guzamala': ['Guzamala Road', 'Maiduguri Road', 'Monguno Road', 'Kukawa Road', 'Nganzai Road'],
  'Hawul': ['Hawul Road', 'Maiduguri Road', 'Biou Road', 'Biu Road', 'Askira/Uba Road'],
  'Jere': ['Jere Road', 'Maiduguri Road', 'Kaga Road', 'Gubio Road', 'Monguno Road'],
  'Kaga': ['Kaga Road', 'Maiduguri Road', 'Jere Road', 'Gubio Road', 'Monguno Road'],
  'Kala/Balge': ['Kala Balge Road', 'Maiduguri Road', 'Nguru Road', 'Kukawa Road', 'Monguno Road'],
  'Konduga': ['Konduga Road', 'Maiduguri Road', 'Damboa Road', 'Biou Road', 'Bama Road'],
  'Mafa': ['Mafa Road', 'Maiduguri Road', 'Dikwa Road', 'Bama Road', 'Konduga Road'],
  'Magumeri': ['Magumeri Road', 'Maiduguri Road', 'Gubio Road', 'Monguno Road', 'Kaga Road'],
  'Marte': ['Marte Road', 'Maiduguri Road', 'Nguru Road', 'Kukawa Road', 'Abadam Road'],
  'Mobbar': ['Mobbar Road', 'Maiduguri Road', 'Nguru Road', 'Kukawa Road', 'Abadam Road'],
  'Ngala': ['Ngala Road', 'Maiduguri Road', 'Dikwa Road', 'Bama Road', 'Mafa Road'],
  'Nganzai': ['Nganzai Road', 'Maiduguri Road', 'Monguno Road', 'Gubio Road', 'Guzamala Road'],
  'Shani': ['Shani Road', 'Maiduguri Road', 'Biou Road', 'Biu Road', 'Askira/Uba Road'],

  // Missing Cross River Streets
  'Abi': ['Abi Road', 'Calabar Road', 'Aba Road', 'Ekot Road', 'Ugep Road'],
  'Akamkpa': ['Akamkpa Road', 'Calabar Road', 'Aba Road', 'Ikom Road', 'Ugep Road'],
  'Akpabuyo': ['Akpabuyo Road', 'Calabar Road', 'Aba Road', 'Ikot Ekpene Road', 'Bakassi Road'],
  'Bakassi': ['Bakassi Road', 'Calabar Road', 'Aba Road', 'Ikot Ekpene Road', 'Akpabuyo Road'],
  'Bekwarra': ['Bekwarra Road', 'Calabar Road', 'Ogoja Road', 'Ugep Road', 'Obudu Road'],
  'Biase': ['Biase Road', 'Calabar Road', 'Aba Road', 'Ugep Road', 'Ikom Road'],
  'Boki': ['Boki Road', 'Calabar Road', 'Ikom Road', 'Obudu Road', 'Ogoja Road'],
  'Etung': ['Etung Road', 'Calabar Road', 'Ikom Road', 'Obubra Road', 'Obudu Road'],
  'Obanliku': ['Obanliku Road', 'Calabar Road', 'Ikom Road', 'Obudu Road', 'Ogoja Road'],
  'Obubra': ['Obubra Road', 'Calabar Road', 'Ikom Road', 'Etung Road', 'Ugep Road'],
  'Odukpani': ['Odukpani Road', 'Calabar Road', 'Aba Road', 'Ikot Ekpene Road', 'Akamkpa Road'],
  'Yakurr': ['Yakurr Road', 'Calabar Road', 'Ugep Road', 'Ikom Road', 'Obubra Road'],
  'Yala': ['Yala Road', 'Calabar Road', 'Ogoja Road', 'Bekwarra Road', 'Obudu Road'],

  // Missing Delta Streets
  'Aniocha North': ['Aniocha North Road', 'Asaba Road', 'Benin Road', 'Ibusa Road', 'Ogwashi-Uku Road'],
  'Aniocha South': ['Aniocha South Road', 'Asaba Road', 'Benin Road', 'Ibusa Road', 'Ogwashi-Uku Road'],
  'Bomadi': ['Bomadi Road', 'Warri Road', 'Patani Road', 'Burutu Road', 'Ughelli Road'],
  'Burutu': ['Burutu Road', 'Warri Road', 'Patani Road', 'Bomadi Road', 'Sagbama Road'],
  'Ethiope East': ['Ethiope East Road', 'Benin Road', 'Sapele Road', 'Warri Road', 'Abraka Road'],
  'Ethiope West': ['Ethiope West Road', 'Benin Road', 'Sapele Road', 'Warri Road', 'Abraka Road'],
  'Ika North East': ['Ika North East Road', 'Benin Road', 'Asaba Road', 'Agbor Road', 'Ogwashi-Uku Road'],
  'Ika South': ['Ika South Road', 'Benin Road', 'Asaba Road', 'Agbor Road', 'Ogwashi-Uku Road'],
  'Isoko North': ['Isoko North Road', 'Warri Road', 'Ughelli Road', 'Ozoro Road', 'Patani Road'],
  'Isoko South': ['Isoko South Road', 'Warri Road', 'Ughelli Road', 'Ozoro Road', 'Patani Road'],
  'Ndokwa East': ['Ndokwa East Road', 'Warri Road', 'Kwale Road', 'Ughelli Road', 'Patani Road'],
  'Ndokwa West': ['Ndokwa West Road', 'Warri Road', 'Kwale Road', 'Ughelli Road', 'Patani Road'],
  'Okpe': ['Okpe Road', 'Warri Road', 'Sapele Road', 'Ughelli Road', 'Effurun Road'],
  'Oshimili North': ['Oshimili North Road', 'Asaba Road', 'Benin Road', 'Ibusa Road', 'Ogwashi-Uku Road'],
  'Oshimili South': ['Oshimili South Road', 'Asaba Road', 'Benin Road', 'Ibusa Road', 'Ogwashi-Uku Road'],
  'Patani': ['Patani Road', 'Warri Road', 'Bomadi Road', 'Burutu Road', 'Sagbama Road'],
  'Udu': ['Udu Road', 'Warri Road', 'Effurun Road', 'Sapele Road', 'Uvwie Road'],
  'Ughelli North': ['Ughelli North Road', 'Warri Road', 'Ughelli South Road', 'Patani Road', 'Effurun Road'],
  'Ughelli South': ['Ughelli South Road', 'Warri Road', 'Ughelli North Road', 'Patani Road', 'Effurun Road'],
  'Ukwuani': ['Ukwuani Road', 'Warri Road', 'Kwale Road', 'Ughelli Road', 'Patani Road'],
  'Warri South West': ['Warri South West Road', 'Warri Road', 'Effurun Road', 'Udu Road', 'Sapele Road'],

  // Missing Ebonyi Streets
  'Afikpo South': ['Afikpo Road', 'Abakaliki Road', 'Enugu Road', 'Ogoja Road', 'Makurdi Road'],
  'Ebonyi': ['Ebonyi Road', 'Abakaliki Road', 'Enugu Road', 'Afikpo Road', 'Ishielu Road'],
  'Ezza South': ['Ezza Road', 'Abakaliki Road', 'Enugu Road', 'Afikpo Road', 'Ishielu Road'],
  'Ishielu': ['Ishielu Road', 'Abakaliki Road', 'Enugu Road', 'Afikpo Road', 'Ezza Road'],
  'Ivo': ['Ivo Road', 'Abakaliki Road', 'Enugu Road', 'Afikpo Road', 'Ishielu Road'],
  'Izzi': ['Izzi Road', 'Abakaliki Road', 'Enugu Road', 'Afikpo Road', 'Ishielu Road'],
  'Ohaukwu': ['Ohaukwu Road', 'Afikpo Road', 'Abakaliki Road', 'Enugu Road', 'Ishielu Road'],
  'Onicha': ['Onicha Road', 'Abakaliki Road', 'Enugu Road', 'Afikpo Road', 'Ishielu Road'],

  // Missing Edo Streets
  'Akoko-Edo': ['Akoko Edo Road', 'Auchi Road', 'Igarra Road', 'Okene Road', 'Ibillo Road'],

  // Missing Ekiti Streets
  'Ekiti East': ['Ekiti East Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],
  'Ekiti South-West': ['Ekiti South West Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],
  'Ekiti West': ['Ekiti West Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],
  'Emure': ['Emure Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],
  'Gbonyin': ['Gbonyin Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],
  'Ido Osi': ['Ido Osi Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],
  'Ilejemeje': ['Ilejemeje Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],
  'Irepodun/Ifelodun': ['Irepodun Ifelodun Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],
  'Ise/Orun': ['Ise Orun Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],
  'Moba': ['Moba Road', 'Ado Ekiti Road', 'Ikere Road', 'Owo Road', 'Akure Road'],

  // Missing Gombe Streets
  'Balanga': ['Balanga Road', 'Gombe Road', 'Bauchi Road', 'Kaltungo Road', 'Billiri Road'],
  'Funakaye': ['Funakaye Road', 'Gombe Road', 'Bauchi Road', 'Dukku Road', 'Kwami Road'],
  'Kwami': ['Kwami Road', 'Gombe Road', 'Bauchi Road', 'Dukku Road', 'Funakaye Road'],
  'Nafada': ['Nafada Road', 'Gombe Road', 'Bauchi Road', 'Dukku Road', 'Funakaye Road'],
  'Shongom': ['Shongom Road', 'Gombe Road', 'Bauchi Road', 'Kaltungo Road', 'Billiri Road'],
  'Yamaltu/Deba': ['Yamaltu Deba Road', 'Gombe Road', 'Bauchi Road', 'Kaltungo Road', 'Billiri Road'],

  // Missing Jigawa Streets
  'Auyo': ['Auyo Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Babura': ['Babura Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Kazaure Road'],
  'Birni Kudu': ['Birni Kudu Road', 'Dutse Road', 'Kano Road', 'Kazaure Road', 'Hadejia Road'],
  'Birnin Kudu': ['Birnin Kudu Road', 'Dutse Road', 'Kano Road', 'Kazaure Road', 'Hadejia Road'],
  'Buji': ['Buji Road', 'Dutse Road', 'Kano Road', 'Kazaure Road', 'Hadejia Road'],
  'Gagarawa': ['Gagarawa Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Garki': ['Garki Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Guri': ['Guri Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Gwaram': ['Gwaram Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Gwiwa': ['Gwiwa Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Jahun': ['Jahun Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Kazaure Road'],
  'Kafin Hausa': ['Kafin Hausa Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Kiri Kasamma': ['Kiri Kasamma Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Kiyawa': ['Kiyawa Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Kaugama': ['Kaugama Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Malam Madori': ['Malam Madori Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Miga': ['Miga Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Roni': ['Roni Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Sule Tankarkar': ['Sule Tankarkar Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Taura': ['Taura Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],
  'Yankwashi': ['Yankwashi Road', 'Dutse Road', 'Kano Road', 'Hadejia Road', 'Ringim Road'],

  // Missing Kaduna Streets
  'Kawo': ['Kawo Road', 'Kaduna Road', 'Zaria Road', 'Kano Road', 'Mando Road'],
  'Kudan': ['Kudan Road', 'Kaduna Road', 'Zaria Road', 'Kano Road', 'Giwa Road'],

  // Missing Kano Streets
  'Ajingi': ['Ajingi Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Albasu': ['Albasu Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Bagwai': ['Bagwai Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Bebeji': ['Bebeji Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Bichi': ['Bichi Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Bunkure': ['Bunkure Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Dambatta': ['Dambatta Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Dawakin Kudu': ['Dawakin Kudu Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Dawakin Tofa': ['Dawakin Tofa Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Doguwa': ['Doguwa Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Gabasawa': ['Gabasawa Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Garko': ['Garko Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Garun Mallam': ['Garun Mallam Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Gaya': ['Gaya Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Jigawa Road'],
  'Gezawa': ['Gezawa Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Kabo': ['Kabo Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Karaye': ['Karaye Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Kibiya': ['Kibiya Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Kiru': ['Kiru Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],
  'Kura': ['Kura Road', 'Kano Road', 'Wudil Road', 'Takai Road', 'Gaya Road'],

  // Missing Katsina Streets
  'Bakori': ['Bakori Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Batagarawa': ['Batagarawa Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Batsari': ['Batsari Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Baure': ['Baure Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Bindawa': ['Bindawa Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Charanchi': ['Charanchi Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Dutsin Ma': ['Dutsin Ma Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Faskari': ['Faskari Road', 'Katsina Road', 'Kano Road', 'Funtua Road', 'Kaduna Road'],
  'Ingawa': ['Ingawa Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Jibi': ['Jibi Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Jibia Road'],
  'Kafur': ['Kafur Road', 'Katsina Road', 'Kano Road', 'Jibia Road', 'Funtua Road'],
  'Kaita': ['Kaita Road', 'Katsina Road', 'Kano Road', 'Jibia Road', 'Funtua Road'],
  'Kankara': ['Kankara Road', 'Katsina Road', 'Kano Road', 'Funtua Road', 'Kaduna Road'],
  'Kankia': ['Kankia Road', 'Katsina Road', 'Kano Road', 'Funtua Road', 'Kaduna Road'],
  'Kurfi': ['Kurfi Road', 'Katsina Road', 'Kano Road', 'Funtua Road', 'Kaduna Road'],
  'Kusada': ['Kusada Road', 'Katsina Road', 'Kano Road', 'Funtua Road', 'Kaduna Road'],
  'Mai\'Adua': ['Mai Adua Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Jibia Road'],
  'Mani': ['Mani Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Mashi': ['Mashi Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Matazu': ['Matazu Road', 'Katsina Road', 'Kano Road', 'Funtua Road', 'Kaduna Road'],
  'Musawa': ['Musawa Road', 'Katsina Road', 'Kano Road', 'Funtua Road', 'Kaduna Road'],
  'Rimi': ['Rimi Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Safana': ['Safana Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Sandamu': ['Sandamu Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],
  'Zango': ['Zango Road', 'Katsina Road', 'Kano Road', 'Daura Road', 'Funtua Road'],

  // Missing Kebbi Streets
  'Aleiro': ['Aleiro Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Arewa Dandi': ['Arewa Dandi Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Augie': ['Augie Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Bagudo': ['Bagudo Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Bunza': ['Bunza Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Dandi': ['Dandi Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Danko/Wasagu': ['Danko Wasagu Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Fakai': ['Fakai Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Zuru Road'],
  'Gwandu': ['Gwandu Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Kalgo': ['Kalgo Road', 'Birnin Kebbi Road', 'Kano Road', 'Sokoto Road', 'Jega Road'],
  'Koko/Besse': ['Koko Besse Road', 'Birnin Kebbi Road', 'Kano Road', 'Sokoto Road', 'Jega Road'],
  'Maiyama': ['Maiyama Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Ngaski': ['Ngaski Road', 'Birnin Kebbi Road', 'Kano Road', 'Yauri Road', 'Zuru Road'],
  'Sakaba': ['Sakaba Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Shanga': ['Shanga Road', 'Birnin Kebbi Road', 'Kano Road', 'Yauri Road', 'Zuru Road'],
  'Suru': ['Suru Road', 'Birnin Kebbi Road', 'Kano Road', 'Jega Road', 'Argungu Road'],
  'Wasagu': ['Wasagu Road', 'Birnin Kebbi Road', 'Kano Road', 'Zuru Road', 'Yauri Road'],

  // Missing Kogi Streets
  'Adavi': ['Adavi Road', 'Lokoja Road', 'Okene Road', 'Ajaokuta Road', 'Kabba Road'],
  'Ankpa': ['Ankpa Road', 'Lokoja Road', 'Okene Road', 'Ajaokuta Road', 'Kabba Road'],
  'Bassa': ['Bassa Road', 'Lokoja Road', 'Okene Road', 'Ajaokuta Road', 'Kabba Road'],
  'Dekina': ['Dekina Road', 'Lokoja Road', 'Okene Road', 'Ajaokuta Road', 'Kabba Road'],
  'Ibaji': ['Ibaji Road', 'Lokoja Road', 'Okene Road', 'Ajaokuta Road', 'Idah Road'],
  'Igalamela-Odolu': ['Igalamela Odolu Road', 'Lokoja Road', 'Okene Road', 'Kabba Road', 'Idah Road'],
  'Ijumu': ['Ijumu Road', 'Lokoja Road', 'Okene Road', 'Kabba Road', 'Kabba/Bunu Road'],
  'Kogi': ['Kogi Road', 'Lokoja Road', 'Okene Road', 'Kabba Road', 'Ajaokuta Road'],
  'Mopa-Muro': ['Mopa Muro Road', 'Lokoja Road', 'Okene Road', 'Kabba Road', 'Ajaokuta Road'],
  'Ofu': ['Ofu Road', 'Lokoja Road', 'Okene Road', 'Idah Road', 'Dekina Road'],
  'Ogori/Magongo': ['Ogori Magongo Road', 'Lokoja Road', 'Okene Road', 'Kabba Road', 'Ajaokuta Road'],
  'Okehi': ['Okehi Road', 'Lokoja Road', 'Okene Road', 'Kabba Road', 'Ajaokuta Road'],
  'Olamaboro': ['Olamaboro Road', 'Lokoja Road', 'Okene Road', 'Idah Road', 'Ankpa Road'],
  'Omala': ['Omala Road', 'Lokoja Road', 'Okene Road', 'Idah Road', 'Ankpa Road'],
  'Yagba East': ['Yagba East Road', 'Lokoja Road', 'Kabba Road', 'Okene Road', 'Mopa-Muro Road'],
  'Yagba West': ['Yagba West Road', 'Lokoja Road', 'Kabba Road', 'Okene Road', 'Mopa-Muro Road'],

  // Missing Kwara Streets
  'Asa': ['Asa Road', 'Ilorin Road', 'Offa Road', 'Jebba Road', 'Oshogbo Road'],
  'Baruten': ['Baruten Road', 'Ilorin Road', 'Kaiama Road', 'Jebba Road', 'Oshogbo Road'],
  'Edu': ['Edu Road', 'Ilorin Road', 'Offa Road', 'Jebba Road', 'Oshogbo Road'],
  'Ekiti': ['Ekiti Road', 'Ilorin Road', 'Offa Road', 'Jebba Road', 'Oshogbo Road'],
  'Ifelodun': ['Ifelodun Road', 'Ilorin Road', 'Offa Road', 'Jebba Road', 'Oshogbo Road'],
  'Isin': ['Isin Road', 'Ilorin Road', 'Offa Road', 'Jebba Road', 'Oshogbo Road'],
  'Moro': ['Moro Road', 'Ilorin Road', 'Offa Road', 'Jebba Road', 'Oshogbo Road'],
  'Oke Ero': ['Oke Ero Road', 'Ilorin Road', 'Offa Road', 'Jebba Road', 'Oshogbo Road'],
  'Pategi': ['Pategi Road', 'Ilorin Road', 'Kaiama Road', 'Jebba Road', 'Baruten Road'],

  // Missing Lagos Streets
  'Ifako-Ijaiye': ['Ifako Ijaiye Road', 'Agege Road', 'Iju Road', 'Ogba Road', 'Oke-Ira Road'],
  'Epe': ['Epe Road', 'Lekki-Epe Express', 'Ijebu Ode Road', 'Itoikin Road', 'Mojoda Road'],
  'Isheri-Osun': ['Isheri Osun Road', 'Isheri Road', 'Igando Road', 'Ikotun Road', 'Iyana Ipaja Road'],

  // Missing Nassarawa Streets
  'Awe': ['Awe Road', 'Lafia Road', 'Akwanga Road', 'Keffi Road', 'Obi Road'],
  'Doma': ['Doma Road', 'Lafia Road', 'Akwanga Road', 'Keffi Road', 'Obi Road'],
  'Karu': ['Karu Road', 'Lafia Road', 'Akwanga Road', 'Keffi Road', 'Abuja Road'],
  'Keana': ['Keana Road', 'Lafia Road', 'Akwanga Road', 'Keffi Road', 'Obi Road'],
  'Kokona': ['Kokona Road', 'Lafia Road', 'Akwanga Road', 'Keffi Road', 'Obi Road'],
  'Obi (Nassarawa)': ['Obi Road', 'Lafia Road', 'Akwanga Road', 'Keffi Road', 'Awe Road'],
  'Toto': ['Toto Road', 'Lafia Road', 'Akwanga Road', 'Keffi Road', 'Obi Road'],

  // Missing Niger Streets
  'Agaie': ['Agaie Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Agwara': ['Agwara Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Borgu': ['Borgu Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Bosso': ['Bosso Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Edati': ['Edati Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Gbako': ['Gbako Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Gurara': ['Gurara Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Katcha': ['Katcha Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Lapai': ['Lapai Road', 'Minna Road', 'Bida Road', 'Kontagora Road', 'Agaie Road'],
  'Lavun': ['Lavun Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Magama': ['Magama Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Mariga': ['Mariga Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Mashegu': ['Mashegu Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Mokwa': ['Mokwa Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Munya': ['Munya Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Paikoro': ['Paikoro Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Rafi': ['Rafi Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Rijau': ['Rijau Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Shiroro': ['Shiroro Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],
  'Tafa': ['Tafa Road', 'Minna Road', 'Suleja Road', 'Bida Road', 'Kontagora Road'],
  'Wushishi': ['Wushishi Road', 'Minna Road', 'Lapai Road', 'Bida Road', 'Kontagora Road'],

  // Missing Osun Streets
  'Atakumosa East': ['Atakumosa East Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Atakumosa West': ['Atakumosa West Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ayedaade': ['Ayedaade Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ayedire': ['Ayedire Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Boluwaduro': ['Boluwaduro Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Boripe': ['Boripe Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ede North': ['Ede North Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ede South': ['Ede South Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Egbedore': ['Egbedore Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ejigbo': ['Ejigbo Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ife Central': ['Ife Central Road', 'Ilesha Road', 'Ife East Road', 'Osogbo Road', 'Ibadan Road'],
  'Ife East': ['Ife East Road', 'Ilesha Road', 'Ife Central Road', 'Osogbo Road', 'Ibadan Road'],
  'Ife North': ['Ife North Road', 'Ilesha Road', 'Ife Central Road', 'Osogbo Road', 'Ibadan Road'],
  'Ife South': ['Ife South Road', 'Ilesha Road', 'Ife Central Road', 'Osogbo Road', 'Ibadan Road'],
  'Ifedayo': ['Ifedayo Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ifelodun (Osun)': ['Ifelodun Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ila': ['Ila Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ilesa East': ['Ilesa East Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ilesha West': ['Ilesha West Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Irepodun': ['Irepodun Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Irewole': ['Irewole Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Isokan': ['Isokan Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Obokun': ['Obokun Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Odo-Otin': ['Odo Otin Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Ola-Oluwa': ['Ola Oluwa Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Olorunda': ['Olorunda Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Oriade': ['Oriade Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],
  'Orolu': ['Orolu Road', 'Ilesha Road', 'Ife Road', 'Osogbo Road', 'Ibadan Road'],

  // Missing Oyo Streets
  'Afijio': ['Afijio Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road', 'Oyo Road'],
  'Akinyele': ['Akinyele Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road', 'Oyo Road'],
  'Atiba': ['Atiba Road', 'Oyo Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road'],
  'Atisbo': ['Atisbo Road', 'Oyo Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road'],
  'Egbeda': ['Egbeda Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road', 'Oyo Road'],
  'Iwajowa': ['Iwajowa Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road', 'Oyo Road'],
  'Kajola': ['Kajola Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road', 'Oyo Road'],
  'Lagelu': ['Lagelu Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road', 'Oyo Road'],
  'Odo-Oluwa': ['Odo Oluwa Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road', 'Oyo Road'],
  'Orire': ['Orire Road', 'Oyo Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road'],
  'Saki East': ['Saki East Road', 'Oyo Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road'],
  'Saki West': ['Saki West Road', 'Oyo Road', 'Ibadan Road', 'Lagos Road', 'Iwo Road'],

  // Missing Plateau Streets
  'Bassa (Plateau)': ['Bassa Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Bokkos': ['Bokkos Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Jos East': ['Jos East Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Kanam': ['Kanam Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Kanke': ['Kanke Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Mangu': ['Mangu Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Mikang': ['Mikang Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Qua\'an Pan': ['Quaan Pan Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Riyom': ['Riyom Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Murtala Muhammed Road'],
  'Shendam': ['Shendam Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Langtang Road'],
  'Wase': ['Wase Road', 'Jos Road', 'Pankshin Road', 'Bauchi Road', 'Langtang Road'],

  // Missing Rivers Streets
  'Abua/Odual': ['Abua Odual Road', 'Port Harcourt Road', 'Ahoada Road', 'Ogbia Road', 'Emago Road'],
  'Akuku Toru': ['Akuku Toru Road', 'Port Harcourt Road', 'Abonnema Road', 'Kula Road', 'Degema Road'],
  'Obio/Akpor': ['Obio Akpor Road', 'Port Harcourt Road', 'Rumuokwuta Road', 'Rumuola Road', 'Elelenwo Road'],
  'Ogba/Egbema/Ndoni': ['Ogba Egbema Ndoni Road', 'Port Harcourt Road', 'Ogba Road', 'Omoku Road', 'Egbema Road'],
  'Ogu/Bolo': ['Ogu Bolo Road', 'Port Harcourt Road', 'Okrika Road', 'Oyigbo Road', 'Eleme Road'],
  'Omuma': ['Omuma Road', 'Port Harcourt Road', 'Etche Road', 'Oyigbo Road', 'Eleme Road'],
  'Opobo/Nkoro': ['Opobo Nkoro Road', 'Port Harcourt Road', 'Bonny Road', 'Ogoni Road', 'Andoni Road'],

  // Missing Sokoto Streets
  'Binji': ['Binji Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Bodinga': ['Bodinga Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Dange Shuni': ['Dange Shuni Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Gada': ['Gada Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Goronyo': ['Goronyo Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Gudu': ['Gudu Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Gwadabawa': ['Gwadabawa Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gusau Road'],
  'Illela': ['Illela Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Isa': ['Isa Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Kebbe': ['Kebbe Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Birnin Kebbi Road'],
  'Kware': ['Kware Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Rabah': ['Rabah Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Sabon Birni': ['Sabon Birni Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Shagari': ['Shagari Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Silame': ['Silame Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Tangaza': ['Tangaza Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Tureta': ['Tureta Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gusau Road'],
  'Wamako': ['Wamako Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],
  'Yabo': ['Yabo Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road', 'Gwadabawa Road'],

  // Missing Taraba Streets
  'Ardo Kola': ['Ardo Kola Road', 'Jalingo Road', 'Yola Road', 'Gembu Road', 'Lau Road'],
  'Bali': ['Bali Road', 'Jalingo Road', 'Yola Road', 'Gembu Road', 'Lau Road'],
  'Donga': ['Donga Road', 'Jalingo Road', 'Yola Road', 'Takum Road', 'Lau Road'],
  'Gassol': ['Gassol Road', 'Jalingo Road', 'Yola Road', 'Takum Road', 'Lau Road'],
  'Ibi': ['Ibi Road', 'Jalingo Road', 'Wukari Road', 'Yola Road', 'Lau Road'],
  'Karim Lamido': ['Karim Lamido Road', 'Jalingo Road', 'Yola Road', 'Gembu Road', 'Lau Road'],
  'Kurmi': ['Kurmi Road', 'Jalingo Road', 'Yola Road', 'Gembu Road', 'Lau Road'],
  'Sardauna': ['Sardauna Road', 'Jalingo Road', 'Gembu Road', 'Gashaka Road', 'Yola Road'],
  'Ussa': ['Ussa Road', 'Jalingo Road', 'Takum Road', 'Yola Road', 'Lau Road'],
  'Yorro': ['Yorro Road', 'Jalingo Road', 'Yola Road', 'Takum Road', 'Lau Road'],
  'Zing': ['Zing Road', 'Jalingo Road', 'Yola Road', 'Takum Road', 'Lau Road'],

  // Missing Yobe Streets
  'Bade': ['Bade Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Bursari': ['Bursari Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Fika': ['Fika Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Fune': ['Fune Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Gogaram': ['Gogaram Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Gujba': ['Gujba Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Gulani': ['Gulani Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Jakusko': ['Jakusko Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Karasuwa': ['Karasuwa Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Machina': ['Machina Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Nangere': ['Nangere Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Tarmuwa': ['Tarmuwa Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Yunusari': ['Yunusari Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],
  'Yusufari': ['Yusufari Road', 'Damaturu Road', 'Maiduguri Road', 'Potiskum Road', 'Gashua Road'],

  // Missing Zamfara Streets
  'Anka': ['Anka Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road'],
  'Birnin Magaji/Kiyaw': ['Birnin Magaji Kiyaw Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road'],
  'Bukkuyum': ['Bukkuyum Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road'],
  'Bungudu': ['Bungudu Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road'],
  'Gummi': ['Gummi Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road'],
  'Maradun': ['Maradun Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road'],
  'Maru': ['Maru Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road'],
  'Shinkafi': ['Shinkafi Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road'],
  'Talata Mafara': ['Talata Mafara Road', 'Gusau Road', 'Sokoto Road', 'Kano Road', 'Kebbi Road'],
};

const NIGERIAN_ALLERGIES = [
  'Penicillin', 'Sulfa', 'Latex', 'Groundnuts', 'Egusi', 'Dust', 'Prawns', 'Catfish', 'Seafood', 'Pollen', 'Milk', 'Eggs', 'Beans', 'Cowpea',
];

const NIGERIAN_CONDITIONS = [
  'Malaria', 'Hypertension', 'Diabetes', 'Asthma', 'Sickle Cell Disease', 'Typhoid Fever', 'Tuberculosis', 'HIV/AIDS', 'Hepatitis B', 'Lassa Fever',
];

const NIGERIAN_INSURANCE = [
  'Leadway Assurance', 'AIICO Insurance', 'Custodian Insurance', 'Niger Insurance', 'Royal Exchange', 'Anchor Insurance',
];

interface PatientFormProps {
  initialValues?: any;
  onSubmit: (values: { [key: string]: string | number }) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function PatientForm({ initialValues, onSubmit, onCancel, loading }: PatientFormProps) {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedLGA, setSelectedLGA] = useState<string>("");

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedLGA('');
  };

  const handleLGAChange = (value: string) => {
    setSelectedLGA(value);
  };

  const availableLGAs = selectedState ? (NIGERIAN_LGAS[selectedState] || []) : [];
  const availableStreets = selectedLGA ? (NIGERIAN_STREETS[selectedLGA] || []) : [];

  return (
    <FormWrapper
      title={initialValues ? 'Edit Patient' : 'Register New Patient'}
      subtitle="Fill in the patient information below"
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    >
      {/* Personal Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter first name!' }]}
            >
              <Input placeholder="e.g., Chukwuemeka" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please enter last name!' }]}
            >
              <Input placeholder="e.g., Okonkwo" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[{ required: true, message: 'Please select date of birth!' }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="Select date" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Please select gender!' }]}
            >
              <Select placeholder="Select gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Blood Group" name="bloodGroup">
              <Select placeholder="Select blood group" allowClear>
                {Object.values(BLOOD_GROUP).map((group) => (
                  <Option key={group} value={group}>{group}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phone Number"
              name="contactNumber"
              rules={[
                { required: true, message: 'Please enter phone number!' },
                { pattern: /^\+234[789]\d{10}$/, message: 'Invalid Nigerian phone number!' },
              ]}
            >
              <Input placeholder="+234 803 456 7890" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: 'email', message: 'Invalid email address!' }]}
            >
              <Input placeholder="email@example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Marital Status" name="maritalStatus">
              <Select placeholder="Select marital status" allowClear>
                {Object.values(MARITAL_STATUS).map((status) => (
                  <Option key={status} value={status}>{status}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Occupation" name="occupation">
              <Input placeholder="e.g., Teacher, Banker, Trader" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Address Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Address Information</h3>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="State"
              name={['address', 'state']}
              rules={[{ required: true, message: 'Please select state!' }]}
            >
              <Select
                showSearch
                placeholder="Select state"
                optionFilterProp="label"
                onChange={handleStateChange}
              >
                {NIGERIAN_STATES.map((state) => (
                  <Option key={state} value={state}>{state}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              key={`lga-${selectedState}`}
              label="LGA"
              name={['address', 'lga']}
              rules={[{ required: true, message: 'Please select LGA!' }]}
            >
              <Select
                showSearch
                placeholder={selectedState ? "Select LGA" : "Select state first"}
                optionFilterProp="label"
                disabled={!selectedState}
                onChange={handleLGAChange}
              >
                {availableLGAs.map((lga) => (
                  <Option key={lga} value={lga}>{lga}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              key={`street-${selectedLGA}`}
              label="Street"
              name={['address', 'street']}
              rules={[{ required: true, message: 'Please select street!' }]}
            >
              <Select
                showSearch
                placeholder={selectedLGA ? "Select street" : "Select LGA first"}
                optionFilterProp="label"
                disabled={!selectedLGA}
              >
                {availableStreets.map((street) => (
                  <Option key={street} value={street}>{street}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Street Address Details"
          name={['address', 'streetDetails']}
          rules={[{ required: true, message: 'Please enter street address details!' }]}
        >
          <Input placeholder="e.g., No. 15, close 3" />
        </Form.Item>
      </div>

      {/* Emergency Contact */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Contact Name"
              name={['emergencyContact', 'name']}
              rules={[{ required: true, message: 'Please enter emergency contact name!' }]}
            >
              <Input placeholder="e.g., Ngozi Okonkwo" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Relationship"
              name={['emergencyContact', 'relationship']}
              rules={[{ required: true, message: 'Please enter relationship!' }]}
            >
              <Select placeholder="Select relationship">
                <Option value="Spouse">Spouse</Option>
                <Option value="Father">Father</Option>
                <Option value="Mother">Mother</Option>
                <Option value="Brother">Brother</Option>
                <Option value="Sister">Sister</Option>
                <Option value="Son">Son</Option>
                <Option value="Daughter">Daughter</Option>
                <Option value="Friend">Friend</Option>
                <Option value="Relative">Relative</Option>
                <Option value="Colleague">Colleague</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Phone Number"
              name={['emergencyContact', 'contactNumber']}
              rules={[
                { required: true, message: 'Please enter emergency contact number!' },
                { pattern: /^\+234[789]\d{10}$/, message: 'Invalid Nigerian phone number!' },
              ]}
            >
              <Input placeholder="+234 802 345 6789" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Medical Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Known Allergies" name="allergies">
              <Select mode="tags" placeholder="Select or type allergies" tokenSeparators={[',']}>
                {NIGERIAN_ALLERGIES.map((allergy) => (
                  <Option key={allergy} value={allergy}>{allergy}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Chronic Conditions" name="chronicConditions">
              <Select mode="tags" placeholder="Select or type conditions" tokenSeparators={[',']}>
                {NIGERIAN_CONDITIONS.map((condition) => (
                  <Option key={condition} value={condition}>{condition}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Medical Notes" name="medicalNotes">
          <TextArea rows={3} placeholder="Any additional medical information" />
        </Form.Item>
      </div>

      {/* Insurance Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Insurance Provider"
              name={['insurance', 'provider']}
              rules={[{ required: true, message: 'Please select insurance provider!' }]}
            >
              <Select
                showSearch
                placeholder="Select insurance provider"
                optionFilterProp="children"
              >
                {NIGERIAN_INSURANCE.map((provider) => (
                  <Option key={provider} value={provider}>{provider}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Policy Number"
              name={['insurance', 'policyNumber']}
              rules={[{ required: true, message: 'Please enter policy number!' }]}
            >
              <Input placeholder="e.g., NHIA/2024/123456" />
            </Form.Item>
         </Col>
        </Row>
      </div>

      {/* Next of Kin */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Next of Kin Information</h3>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Full Name"
              name="nextOfKin.name"
              rules={[{ required: true, message: 'Please enter next of kin name!' }]}
            >
              <Input placeholder="e.g., Ngozi Okonkwo" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Relationship"
              name="nextOfKin.relationship"
              rules={[{ required: true, message: 'Please select relationship!' }]}
            >
              <Select placeholder="Select relationship">
                <Option value="Spouse">Spouse</Option>
                <Option value="Father">Father</Option>
                <Option value="Mother">Mother</Option>
                <Option value="Brother">Brother</Option>
                <Option value="Sister">Sister</Option>
                <Option value="Son">Son</Option>
                <Option value="Daughter">Daughter</Option>
                <Option value="Friend">Friend</Option>
                <Option value="Relative">Relative</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phone Number"
              name="nextOfKin.contactNumber"
              rules={[
                { required: true, message: 'Please enter phone number!' },
                { pattern: /^\+234[789]\d{10}$/, message: 'Invalid Nigerian phone number!' },
              ]}
            >
              <Input placeholder="+234 803 456 7890" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Address"
              name="nextOfKin.address"
            >
              <Input placeholder="Next of kin address" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </FormWrapper>
  );
}
