// Fill out your copyright notice in the Description page of Project Settings.


#include "ToppingStation.h"
#include "CPizza.h"
#include "BasicPlayer.h"

// Sets default values for this component's properties
UToppingStation::UToppingStation()
{
	// Set this component to be initialized when the game starts, and to be ticked every frame.  You can turn these features
	// off to improve performance if you don't need them.

	// ...
}


// Called when the game starts
void UToppingStation::BeginPlay()
{
	Super::BeginPlay();

	// ...
	
}

void UToppingStation::OnView()
{
	APawn* Player = GetWorld()->GetFirstPlayerController()->GetPawn();
	ABasicPlayer* PlayerClass = Cast<ABasicPlayer>(Player);

	if (PlayerClass)
	{
		PlayerClass->SetFocused("TOPPING STATION");
	}
}


FString UToppingStation::GetToppingToAdd()
{
	const int DiffToppings = 5;
	FString ToppingsList[DiffToppings] =
	{
		"Cheese", 
		"Pineapple",
		"Ham",
		"Pepperoni",
		"Cheese"
	};

	int RandomToppingIndex = FMath::RandRange(0, (DiffToppings)-1);

	FString ReturnedString = ToppingsList[RandomToppingIndex];

	return ReturnedString;

}

void UToppingStation::AddToppingsToPizza(CPizza* Pizza)
{
	bool bAddingToppings = true;

	while (bAddingToppings)
	{
		bAddingToppings = Pizza->AddTopping(GetToppingToAdd());
		if (Pizza->GetToppings() > 0)
		{
			UE_LOG(LogClass, Log, TEXT("Added: %s"), *Pizza->GetToppingList().back());
		}
	}
}

// The Pizza Baser is the first part of making a pizza.
// It generates the initial object and also selects which sauce base it has.
void UToppingStation::OnInteract()
{
	// Check if we have a Pizza already
	APawn* Player = GetWorld()->GetFirstPlayerController()->GetPawn();
	ABasicPlayer* PlayerClass = Cast<ABasicPlayer>(Player);

	if (PlayerClass)
	{
		// If they havent already got a pizza.
		if (PlayerClass->GetHeldPizza() != nullptr)
		{
			// Get our Pizza
			CPizza* CurrentPizza = PlayerClass->GetHeldPizza();

			if (CurrentPizza->GetCooked() == "Uncooked")
			{
				// Begin adding Toppings
				AddToppingsToPizza(CurrentPizza);

				UE_LOG(LogClass, Log, TEXT("ADDED TOPPINGS"));
			}
			else
			{
				UE_LOG(LogClass, Log, TEXT("CANT ADD TOPPINGS TO A COOKED PIZZA"));
			}
		}
		else
		{
			UE_LOG(LogClass, Log, TEXT("YOU DON'T HAVE A PIZZA"));
		}
	}
}


