// import React, { useEffect, useState, useRef } from "react";
// import { Input, TextField, Button } from "@mui/material";
// import { NFTStorage } from "https://cdn.jsdelivr.net/npm/nft.storage/dist/bundle.esm.min.js";

// export default function AddRecord() {

//     const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJBMDIzOTZFODE4MDYwZkZjQWI3QkNhZTUxMTZkZDYxNTI0YUE2NTMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTkzMjMwNDI0NiwibmFtZSI6ImUgY2hpa2l0c2EifQ.Qxo3Uf9AozEi_aqN4gFzG8DeZiDgkYTXxIECZ23ulD0";
//     const upload = async () => {
//         const storage = new NFTStorage({ token });
//         if (!multiple) {
//           try {
//             props.setTotalUploads((totalUploads) => totalUploads + 1);
//             const metadata = await storage.store({
//               name: title,
//               description:
//                 "Using the nft.storage metadata API to create ERC-1155 compatible metadata.",
//               image: file[0],
//             });
//             console.log(metadata);
//             const { ipnft } = metadata;
//             const { name } = metadata.data;
//             const { href } = metadata.embed().image;
//             await fetchInfo(ipnft);
//             console.log(name + " " + href + " " + ipnft);
//             props.createData(name, getDate(), ipnft, href);
//             console.log({ "IPFS URL for the metadata": metadata.url });
//             console.log({ "metadata.json contents": metadata.data });
    
//             console.log({
//               "metadata.json contents with IPFS gateway URLs": metadata.embed(),
//             });
//             setTitle("");
//           } catch (err) {
//             console.log(err);
//           }
//         } else {
//           try {
//             props.setTotalUploads((totalUploads) => totalUploads + 1);
//             const cid = await storage.storeDirectory(file);
//             console.log({ files: Array.from(file).map((f) => f.name), cid });
//             const status = await storage.status(cid);
//             console.log('status',status);
//             const cidUrl=`https://${cid}.ipfs.nftstorage.link/`
//             props.createData(title,getDate(),cid,cidUrl);
//             await fetchInfo(cid);
//             console.log(status);
//             setTitle();
//           } catch (err) {
//             console.log(err);
//           }
//         }
//       };

//     return (
//         <div className="App take-appointment-container .add-records">
//             <div className="back">
//                 back
//             </div>
//             <div className="appointment-title">
//                 New Record
//             </div>
//             <div className="data-container">
//                 <form action="">
//                     <div className="data-list problem-container">
//                         <div className="item-title">
//                             Subject of Record
//                         </div>
//                         <div className="item-data">
//                             <input type="text" placeholder='Diabetes Record' />
//                         </div>
//                     </div>
//                     <div className="data-list problem-container">
//                         <div className="item-title">
//                             Date of Disease
//                         </div>
//                         <div className="item-data">
//                             <input type="text" />
//                         </div>
//                     </div>
//                     <div className="problem-container">
//                         <div className="item-title">
//                             Add File
//                         </div>
//                         <div className="item-data">
//                             <input type="file" id="photo-upload" name="record-photo" placeholder="" accept=".jpg" />
//                             <i class="fas fa-upload"></i>
//                             <p>Browse File Here</p>
//                         </div>
//                     </div>
//                 </form>
//                 <div className="add-record set-appointment">
//                     <button >Add Record</button>
//                 </div>
//                 <div></div>
//             </div>
//         </div>
//     )
// }