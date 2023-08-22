## Status: Done

### Auction app

1. Use uuid as id
2. Sign in/Sign up with username and password:
   1. Each user has:
      1. username <unique>
      2. password
3. Each user can create auction product:
   1. Each product has:
      1. Name
      2. Owner_id <user_id>
      3. Description
      4. Price
      5. Views
      6. Highest bid
      7. Ending time <unix>
4. The first time user view product, increase product's views by one -- done
5. List most expensive product -- done
6. List ending soonest product -- done
7. List most viewed product -- done
8. Count product likes -- done
9. Search product / Fuzzy / Auto Complete
10. View our product

### Design data structure

1. User: Each user has many properties ==> HashSet
2. User unique: Use `exists` command
3. Product: Each product has many properties ==> HashSet (consider RedisJSON later)
4. Most expensive: Use SortedSet
5. Ending soonest: Use RedisSearch
