# chmurowe-projekt
Projekt na zaliczenie przedmiotu technologie chmurowe, połączony z projektem z bezpieczeństwa aplikacji web


Celem było stworzenie pełnej aplikacji webowej, uruchamianej przez dockera i/lub kubernetesa. Mamy tu prostą obsługę i zarządzanie bazy esportowych graczy i drużyn

Przed użyciem zapoznaj się z treścią instrukcji dołączonej do repozytorium w pliku README, bądź skonsultuj się z lekarzem lub kompetentnym programistą, gdyż każdy kod niewłaściwie stosowany zagraża twojemu życiu lub poczuciu estetyki.

INSTRUKCJA ODPALENIA:
(komendy uruchamiane w głównym katalogu projektu)

1. Upewnij się że kubernetes jest włączony (kubectl musi działać)
2. utworzenie configmap dla realm z keycloaka
 kubectl create configmap keycloak-realm --from-file=realm-export.json=./k8s/keycloak/realm-export.json
3. Wdrożenie wszystkich komponentów

    kubectl apply -f k8s/mongo/
    kubectl apply -f k8s/data-service/
    kubectl apply -f k8s/analytic-service/
    kubectl apply -f k8s/frontend/
    kubectl apply -f k8s/keycloak/
    kubectl apply -f k8s/ingress.yaml

4. Upewnienie się, że wszystkie pody uruchomiły się bez błędów (kubectl get pods)
5. przejdź pod http://localhost/ , keycloak poprosi o zalogowanie,
6. zaloguj się jako któryś z użytkowników:
    - user (hasło: user) - zwykły użytkownik bez specjalnych uprawnień
    - admin (hasło: admin) - jak sama nazwa wskazuje, jest to admin

7. Uwaga, przy pierwszym odpaleniu baza danych jest pusta, będąc zalogowanym jako admin można na spokojnie dodawać i usuwać teamy/graczy
